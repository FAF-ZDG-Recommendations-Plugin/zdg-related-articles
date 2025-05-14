<?php
/**
 * Retry Handler for ZDG Related Articles plugin
 * Handles automatic retry of failed indexing attempts
 */

// Exit if accessed directly
defined('ABSPATH') || exit;

/**
 * Check API connection and return status
 * 
 * @return array Status with success flag and message
 */
function zdg_check_api_connection() {
    $api_url = get_option('zdg_api_url', '');
    
    if (empty($api_url)) {
        return array(
            'success' => false,
            'message' => 'API URL not configured'
        );
    }
    
    $test_url = trailingslashit($api_url) . 'test';
    $response = wp_remote_get($test_url, array(
        'timeout' => 10
    ));
    
    if (is_wp_error($response)) {
        return array(
            'success' => false,
            'message' => $response->get_error_message()
        );
    }
    
    $response_code = wp_remote_retrieve_response_code($response);
    
    if ($response_code >= 200 && $response_code < 300) {
        return array(
            'success' => true,
            'message' => 'API connection successful'
        );
    } else {
        return array(
            'success' => false,
            'message' => "API responded with code {$response_code}"
        );
    }
}

/**
 * AJAX handler for checking API connection
 * 
 * @return void Sends JSON response
 */
function zdg_ajax_check_api_connection() {
    // Verify nonce
    if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'zdg_index_post_nonce')) {
        wp_send_json_error(array('message' => 'Security check failed'));
        return;
    }
    
    $result = zdg_check_api_connection();
    
    if ($result['success']) {
        wp_send_json_success(array('message' => $result['message']));
    } else {
        wp_send_json_error(array('message' => $result['message']));
    }
}
add_action('wp_ajax_zdg_check_api_connection', 'zdg_ajax_check_api_connection');

/**
 * Auto retry failed indexing attempts when API becomes available again
 * This runs on a scheduled cron event
 * 
 * @return void
 */
function zdg_auto_retry_failed_indexing() {
    zdg_debug_log('Running auto retry for failed indexing attempts');
    
    // First check if API is available
    $api_check = zdg_check_api_connection();
    
    if (!$api_check['success']) {
        zdg_debug_log('API not available for auto retry: ' . $api_check['message']);
        return;
    }
    
    // Get failed attempts
    $failed_attempts = zdg_get_failed_indexing_attempts();
    
    if (empty($failed_attempts)) {
        zdg_debug_log('No failed indexing attempts to retry');
        return;
    }
    
    zdg_debug_log('Found ' . count($failed_attempts) . ' failed indexing attempts to retry');
    
    // Process each failed attempt
    $successful = 0;
    $still_failed = 0;
    
    foreach ($failed_attempts as $attempt) {
        $post_id = $attempt['post_id'];
        $post = get_post($post_id);
        
        if (!$post || $post->post_status !== 'publish' || $post->post_type !== 'post') {
            // Post no longer exists or is not publishable, remove from failed list
            zdg_debug_log("Post ID {$post_id} no longer exists or is not publishable, removing from failed list");
            zdg_remove_from_failed_indexing($post_id);
            continue;
        }
        
        // Get API URL
        $api_url = get_option('zdg_api_url', '');
        
        // Try to index the post
        $index_result = zdg_send_post_to_api($post, $api_url, true);
        
        if ($index_result['success']) {
            zdg_debug_log("Auto retry successful for post ID {$post_id}");
            $successful++;
            // Removal from failed list is already handled in zdg_send_post_to_api function
        } else {
            zdg_debug_log("Auto retry failed for post ID {$post_id}: " . $index_result['message']);
            $still_failed++;
        }
        
        // Add a small delay to avoid overwhelming the API
        sleep(1);
    }
    
    zdg_debug_log("Auto retry completed. Successfully indexed: {$successful}, Still failed: {$still_failed}");
}

/**
 * Register cron schedule for auto retry
 * 
 * @return void
 */
function zdg_register_retry_cron() {
    if (!wp_next_scheduled('zdg_retry_failed_indexing')) {
        wp_schedule_event(time(), 'hourly', 'zdg_retry_failed_indexing');
    }
}
add_action('wp', 'zdg_register_retry_cron');

// Add the action hook for the cron event
add_action('zdg_retry_failed_indexing', 'zdg_auto_retry_failed_indexing');

/**
 * Clean up scheduled events on plugin deactivation
 * 
 * @return void
 */
function zdg_cleanup_retry_cron() {
    wp_clear_scheduled_hook('zdg_retry_failed_indexing');
}
register_deactivation_hook(ZDG_RELATED_ARTICLES_FILE, 'zdg_cleanup_retry_cron');
