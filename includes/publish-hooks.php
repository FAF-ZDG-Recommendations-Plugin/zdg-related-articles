<?php
// Function for detailed debugging
function zdg_debug_log($message) {
    if (defined('WP_DEBUG') && WP_DEBUG === true) {
        if (is_array($message) || is_object($message)) {
            error_log('[ZDG Related Articles] ' . print_r($message, true));
        } else {
            error_log('[ZDG Related Articles] ' . $message);
        }
    }
}

// Function to index article at publishing or updating
function zdg_index_article( $new_status, $old_status, $post ) {
    zdg_debug_log("Post status change: {$old_status} -> {$new_status} for post ID {$post->ID}");
    
    // Handle both new publications and updates to published posts
    if ('publish' !== $new_status) {
        zdg_debug_log("Skipping indexing for post ID {$post->ID} - not published");
        return;
    }
    
    // Track if this is an update (post was already published) or a new publish
    $is_update = ('publish' === $old_status);
      // For new publications, always index
    if (!$is_update) {
        zdg_debug_log("Handling new publish for post ID {$post->ID}");
    } else {
        // For updates, check if title or content has changed
        $should_index = false;
        $revision = wp_get_post_revisions($post->ID, array('numberposts' => 1));
        
        if (empty($revision)) {
            // If no revisions, this is likely the first update - index it
            zdg_debug_log("No revisions found for post ID {$post->ID}, assuming first update");
            $should_index = true;
            
        } else {
            // Get the most recent revision
            $last_revision = array_shift($revision);
            
            // Compare current title and content with the previous revision
            $title_changed = ($post->post_title !== $last_revision->post_title);
            $content_changed = ($post->post_content !== $last_revision->post_content);
            
            if (!$title_changed && !$content_changed) {
                zdg_debug_log("Skipping indexing for post ID {$post->ID} - no changes to title or content");
                return;
            }
            
            zdg_debug_log("Handling update for post ID {$post->ID} - detected changes in " . 
                          ($title_changed ? "title" : "") . 
                          (($title_changed && $content_changed) ? " and " : "") . 
                          ($content_changed ? "content" : ""));
            $should_index = true;
        }
        
        // Skip if we determined there's nothing to update
        if (!$should_index) {
            zdg_debug_log("Skipping indexing for post ID {$post->ID} - no relevant changes detected");
            return;
        }
    }
    if ( 'post' !== $post->post_type ) {
        zdg_debug_log("Skipping indexing for post ID {$post->ID} - not a post type");
        return;
    }
      // Get API URL from settings
    $api_url = get_option('zdg_api_url', '');
    
    // Check if API URL is configured
    if (empty($api_url)) {
        zdg_debug_log("Skipping indexing for post ID {$post->ID} - API URL not configured");
        return;
    }
    
    $endpoint = trailingslashit($api_url) . 'index';
    zdg_debug_log("Using API endpoint: {$endpoint}");
      // Get post content
    $post_content =  wp_strip_all_tags($post->post_content);
    $post_title = $post->post_title;
    $post_id = $post->ID;
    
    // Prepare data for indexing
    $index_data = array(
        'id' => $post_id,
        'title' => $post_title,
        'content' => $post_content,
        'guid' => get_permalink($post_id),
        'update' => $is_update ? 'true' : 'false', // Set to 'true' for updates, 'false' for new posts
        'post_date' => get_the_date('Y-m-d H:i:s', $post_id)
    );
    
    zdg_debug_log("Sending data to API for post ID {$post_id}:");
    zdg_debug_log($index_data);
    
    // Send data to API
    $response = wp_remote_post( $endpoint, array(
        'headers'     => array('Content-Type' => 'application/json'),
        'body'        => json_encode($index_data),
        'method'      => 'POST',
        'data_format' => 'body',
        'timeout'     => 45,
    ));
    
    if (is_wp_error($response)) {
        $error_message = $response->get_error_message();
        zdg_debug_log("Error indexing article ID {$post_id}: {$error_message}");
        error_log("Error indexing article ID {$post_id}: " . $error_message);
        zdg_record_failed_indexing($post_id, $error_message);
    } else {
        $response_code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        
        zdg_debug_log("API Response code: {$response_code}");
        zdg_debug_log("API Response body: {$body}");
        
        if ($response_code >= 200 && $response_code < 300) {
            zdg_debug_log("Successfully indexed article ID {$post_id}");
            error_log("Successfully indexed article ID {$post_id}");
            zdg_remove_from_failed_indexing($post_id);
        } else {
            zdg_debug_log("Error indexing article ID {$post_id}: HTTP code {$response_code}, response: {$body}");
            error_log("Error indexing article ID {$post_id}: HTTP code {$response_code}, response: {$body}");
            zdg_record_failed_indexing($post_id, "HTTP code {$response_code}, response: {$body}");
        }
    }
}

// Function to manually index a post (called via AJAX)
function zdg_manual_index_post() {
    zdg_debug_log("Manual indexing requested");
    
    // Verify nonce
    if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'zdg_index_post_nonce')) {
        zdg_debug_log("Manual indexing failed: Security check failed");
        wp_send_json_error(array('message' => 'Security check failed'));
        return;
    }
    
    // Check for post ID
    if (!isset($_POST['post_id']) || empty($_POST['post_id'])) {
        zdg_debug_log("Manual indexing failed: No post ID provided");
        wp_send_json_error(array('message' => 'No post ID provided'));
        return;
    }
    
    $post_id = intval($_POST['post_id']);
    $post = get_post($post_id);
    
    if (!$post || $post->post_status !== 'publish' || $post->post_type !== 'post') {
        zdg_debug_log("Manual indexing failed: Invalid post or post is not published - ID: {$post_id}");
        wp_send_json_error(array('message' => 'Invalid post or post is not published'));
        return;
    }
      // Get API URL from settings
    $api_url = get_option('zdg_api_url', '');
    
    // Check if API URL is configured
    if (empty($api_url)) {
        zdg_debug_log("Manual indexing failed for post ID {$post_id}: API URL not configured");
        wp_send_json_error(array('message' => 'API URL not configured. Please configure it in Settings > ZDG Related Articles.'));
        return;
    }
    
    $endpoint = trailingslashit($api_url) . 'index';
    zdg_debug_log("Using API endpoint for manual indexing: {$endpoint}");
    
    // Get post content
    $post_content =  wp_strip_all_tags($post->post_content);
    $post_title = $post->post_title;
      // Get the 'force_update' parameter from the AJAX request, defaults to true for manual indexing
    $force_update = isset($_POST['force_update']) ? filter_var($_POST['force_update'], FILTER_VALIDATE_BOOLEAN) : true;
    
    // Prepare data for indexing
    $index_data = array(
        'id' => $post_id,
        'title' => $post_title,
        'content' => $post_content,
        'guid' => get_permalink($post_id),
        'update' => $force_update ? 'true' : 'false', // Always set to 'true' for manual indexing unless specified
        'post_date' => get_the_date('Y-m-d H:i:s', $post_id)
    );
    
    zdg_debug_log("Sending data to API for manual indexing of post ID {$post_id}:");
    zdg_debug_log($index_data);
    
    // Send data to API
    $response = wp_remote_post( $endpoint, array(
        'headers'     => array('Content-Type' => 'application/json'),
        'body'        => json_encode($index_data),
        'method'      => 'POST',
        'data_format' => 'body',
        'timeout'     => 45,
    ));
    
    if (is_wp_error($response)) {
        $error_message = $response->get_error_message();
        zdg_debug_log("Manual indexing failed: API Error: {$error_message}");
        wp_send_json_error(array(
            'message' => 'API Error: ' . $error_message
        ));
    } else {
        $response_code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        
        zdg_debug_log("Manual indexing API Response code: {$response_code}");
        zdg_debug_log("Manual indexing API Response body: {$body}");
          if ($response_code >= 200 && $response_code < 300) {
            zdg_debug_log("Successfully manually indexed post ID {$post_id}");
            // Remove the post from failed indexing attempts list
            zdg_remove_from_failed_indexing($post_id);
            wp_send_json_success(array(
                'message' => "Successfully indexed post ID {$post_id}"
            ));
        } else {
            zdg_debug_log("Manual indexing failed: API returned code {$response_code}. Response: {$body}");
            wp_send_json_error(array(
                'message' => "Error: API returned code {$response_code}. Response: {$body}"
            ));
        }
    }
}
add_action('wp_ajax_zdg_manual_index_post', 'zdg_manual_index_post');

// Function to handle batch indexing of posts via AJAX
function zdg_batch_index_posts() {
    zdg_debug_log("Batch indexing requested");
    
    // Verify nonce
    if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'zdg_index_post_nonce')) {
        zdg_debug_log("Batch indexing failed: Security check failed");
        wp_send_json_error(array('message' => 'Security check failed'));
        return;
    }
      // Get parameters
    $offset = isset($_POST['offset']) ? intval($_POST['offset']) : 0;
    $batch_size = isset($_POST['batch_size']) ? intval($_POST['batch_size']) : 5;
    $date_after = isset($_POST['date_after']) ? sanitize_text_field($_POST['date_after']) : '';
    
    // Limit batch size for performance, but allow larger batches for efficiency
    $batch_size = min($batch_size, 20);
    
    // Get API URL from settings
    $api_url = get_option('zdg_api_url', '');
    
    // Check if API URL is configured
    if (empty($api_url)) {
        zdg_debug_log("Batch indexing failed: API URL not configured");
        wp_send_json_error(array('message' => 'API URL not configured. Please configure it in Settings > ZDG Related Articles.'));
        return;
    }
    
    zdg_debug_log("Processing batch with offset: {$offset}, size: {$batch_size}, date_after: {$date_after}");
    
    // Get a batch of posts to process
    $args = array(
        'post_type' => 'post',
        'post_status' => 'publish',
        'posts_per_page' => $batch_size,
        'offset' => $offset,
        'orderby' => 'date',
        'order' => 'DESC',
    );
    
    // Add date filter if provided
    if (!empty($date_after)) {
        $formatted_date = '';
        $date_obj = date_create($date_after);
        if ($date_obj) {
            $formatted_date = date_format($date_obj, 'Y-m-d H:i:s');
            $args['date_query'] = array(
                array(
                    'after' => $formatted_date,
                    'inclusive' => false,
                ),
            );
        }
    }
    
    $query = new WP_Query($args);
    $posts = $query->posts;
    
    zdg_debug_log("Found " . count($posts) . " posts to process in this batch");
      // Track results
    $results = array(
        'processed' => 0,
        'successful' => 0,
        'failed' => 0,
        'continue' => true,
        'post_ids' => array()
    );
    
    // Process each post
    foreach ($posts as $post) {
        $results['processed']++;
        $results['post_ids'][] = $post->ID;
        
        // Index the post
        $index_result = zdg_send_post_to_api($post, $api_url, true);
        
        if ($index_result['success']) {
            $results['successful']++;
        } else {
            $results['failed']++;
            zdg_debug_log("Failed to index post ID {$post->ID}: " . $index_result['message']);
        }
          // Add a very small delay to avoid overwhelming the API
        usleep(100000); // 100ms delay
    }
      // Determine if we should continue (are there more posts?)
    $results['continue'] = count($posts) >= $batch_size;
    
    zdg_debug_log("Batch processing completed. Processed: {$results['processed']}, Successful: {$results['successful']}, Failed: {$results['failed']}, Continue: " . ($results['continue'] ? 'true' : 'false'));
    
    wp_send_json_success($results);
}
add_action('wp_ajax_zdg_batch_index_posts', 'zdg_batch_index_posts');

// Create a wrapper function for the save_post hook
function zdg_handle_post_update($post_id, $post, $update) {
    // Skip auto-saves and revisions
    if ((defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) || wp_is_post_revision($post_id)) {
        zdg_debug_log("Skipping autosave or revision for post ID {$post_id}");
        return;
    }
    
    // Skip new posts (they'll be handled by transition_post_status)
    if (!$update) {
        zdg_debug_log("Skipping new post in save_post hook - will be handled by transition_post_status");
        return;
    }
    
    // Only proceed for published posts
    if ($post->post_status !== 'publish') {
        zdg_debug_log("Skipping non-published post in save_post hook");
        return;
    }
    
    zdg_debug_log("Post update detected (save_post) for post ID {$post_id}");
    
    // Call our indexing function with appropriate parameters for an update
    // We're simulating a transition from published to published
    zdg_index_article('publish', 'publish', $post);
}

// Hook the function to both transition_post_status and save_post actions
add_action('transition_post_status', 'zdg_index_article', 10, 3);
add_action('save_post', 'zdg_handle_post_update', 10, 3);

/**
 * Send a post to the API for indexing
 * 
 * @param WP_Post $post The post object to index
 * @param string $api_url The API URL to use
 * @param boolean $force_update Whether to force an update even if the post exists
 * @return array Results with success status and message
 */
function zdg_send_post_to_api($post, $api_url, $force_update = false) {
    if (!$post || !is_object($post) || !isset($post->ID)) {
        return array(
            'success' => false,
            'message' => 'Invalid post object'
        );
    }
    
    // Get post content
    $post_content =  wp_strip_all_tags($post->post_content);
    $post_title = $post->post_title;
    $post_id = $post->ID;
    
    $endpoint = trailingslashit($api_url) . 'index';
    zdg_debug_log("Using API endpoint for indexing post {$post_id}: {$endpoint}");
    
    // Prepare data for indexing
    $index_data = array(
        'id' => $post_id,
        'title' => $post_title,
        'content' => $post_content,
        'guid' => get_permalink($post_id),
        'update' => $force_update ? 'true' : 'false',
        'post_date' => get_the_date('Y-m-d H:i:s', $post_id)
    );
    
    zdg_debug_log("Sending data to API for indexing post ID {$post_id}");
    
    // Send data to API
    $response = wp_remote_post($endpoint, array(
        'headers'     => array('Content-Type' => 'application/json'),
        'body'        => json_encode($index_data),
        'method'      => 'POST',
        'data_format' => 'body',
        'timeout'     => 45,
    ));
    
    if (is_wp_error($response)) {
        $error_message = $response->get_error_message();
        zdg_debug_log("Indexing failed for post {$post_id}: API Error: {$error_message}");
        zdg_record_failed_indexing($post_id, $error_message);
        return array(
            'success' => false,
            'message' => 'API Error: ' . $error_message
        );
    }
    
    $response_code = wp_remote_retrieve_response_code($response);
    $body = wp_remote_retrieve_body($response);
    
    zdg_debug_log("API Response for post {$post_id} - code: {$response_code}, body: {$body}");
    
    if ($response_code >= 200 && $response_code < 300) {
        zdg_debug_log("Successfully indexed post ID {$post_id}");
        zdg_remove_from_failed_indexing($post_id);
        return array(
            'success' => true,
            'message' => "Successfully indexed post ID {$post_id}",
            'response' => $body
        );
    } else {
        // Try to parse error message from JSON response
        $error_message = "API responded with code {$response_code}";
        $json_response = json_decode($body, true);
        if ($json_response && isset($json_response['message'])) {
            $error_message .= ": " . $json_response['message'];
        } else if (!empty($body)) {
            $error_message .= ": " . $body;
        }
        
        zdg_debug_log("Indexing failed for post {$post_id}: {$error_message}");
        zdg_record_failed_indexing($post_id, $error_message);
        return array(
            'success' => false,
            'message' => $error_message
        );
    }
}

/**
 * Record a failed indexing attempt to retry later
 * 
 * @param int $post_id The ID of the post that failed to index
 * @param string $error_message The error message
 * @return bool Success status
 */
function zdg_record_failed_indexing($post_id, $error_message) {
    $failed_attempts = get_option('zdg_failed_indexing_attempts', array());
      // Check if this post ID is already in the list
    $exists = false;
    foreach ($failed_attempts as $key => $attempt) {
        if (intval($attempt['post_id']) === intval($post_id)) {
            // Update the existing record
            $failed_attempts[$key]['error_message'] = $error_message;
            $failed_attempts[$key]['attempt_count']++;
            $failed_attempts[$key]['last_attempt'] = time();
            $exists = true;
            break;
        }
    }
    
    // If not exists, add a new entry
    if (!$exists) {
        $failed_attempts[] = array(
            'post_id' => $post_id,
            'error_message' => $error_message,
            'attempt_count' => 1,
            'first_attempt' => time(),
            'last_attempt' => time(),
            'post_title' => get_the_title($post_id)
        );
    }
    
    // Sort by last attempt (most recent first)
    usort($failed_attempts, function($a, $b) {
        return $b['last_attempt'] - $a['last_attempt'];
    });
    
    // Limit to a reasonable number to prevent option bloat (keep most recent 100)
    $failed_attempts = array_slice($failed_attempts, 0, 100);
    
    zdg_debug_log("Recording failed indexing attempt for post ID {$post_id}");
    
    // Save updated list
    return update_option('zdg_failed_indexing_attempts', $failed_attempts);
}

/**
 * Remove a post from the failed indexing attempts list
 * 
 * @param int $post_id The ID of the post to remove
 * @return bool Success status
 */
function zdg_remove_from_failed_indexing($post_id) {
    $failed_attempts = get_option('zdg_failed_indexing_attempts', array());
    
    // Filter out the post ID
    $failed_attempts = array_filter($failed_attempts, function($attempt) use ($post_id) {
        return intval($attempt['post_id']) !== intval($post_id);
    });
      $removed_count = count(get_option('zdg_failed_indexing_attempts', array())) - count($failed_attempts);
    zdg_debug_log("Removing post ID {$post_id} from failed indexing attempts - Removed: {$removed_count} entries");
    
    // Re-index the array
    $failed_attempts = array_values($failed_attempts);
    
    // Save updated list
    $update_result = update_option('zdg_failed_indexing_attempts', $failed_attempts);
    zdg_debug_log("Update result for failed indexing attempts: " . ($update_result ? 'Success' : 'Failed'));
    return $update_result;
}

/**
 * Get the list of failed indexing attempts
 * 
 * @return array List of failed attempts
 */
function zdg_get_failed_indexing_attempts() {
    return get_option('zdg_failed_indexing_attempts', array());
}