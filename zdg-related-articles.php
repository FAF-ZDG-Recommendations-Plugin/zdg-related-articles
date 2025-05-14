<?php
/**
 * Plugin Name: ZDG Related Articles
 * Description: Adds a related articles section at the end of articles and a panel to the post editor sidebar for customization.
 * Version: 1.0
 * Author: Alexandru Buzu
 */

defined('ABSPATH') || exit;

// Add settings link on plugin page
function zdg_add_settings_link($links) {
    $settings_link = '<a href="options-general.php?page=zdg-related-articles">' . __('Settings') . '</a>';
    array_unshift($links, $settings_link);
    return $links;
}

// Get the base name of the plugin file for the filter hook
$plugin_base_name = plugin_basename(__FILE__);
add_filter("plugin_action_links_$plugin_base_name", 'zdg_add_settings_link');

// Enqueue editor scripts
function zdg_enqueue_sidebar_script() {
    wp_enqueue_script(
        'zdg-sidebar',
        plugins_url('build/index.js', __FILE__),
        array('wp-plugins', 'wp-edit-post', 'wp-element', 'wp-components'),
        filemtime(plugin_dir_path(__FILE__) . 'build/index.js'),
        true
    );
}
add_action('enqueue_block_editor_assets', 'zdg_enqueue_sidebar_script');

function zdg_enqueue_scripts() {
    wp_enqueue_script('zdg-related-articles', plugin_dir_url(__FILE__) . 'build/index.js', array('wp-api-fetch', 'wp-element'), '1.0', true);    // Get the API URL from settings (no default)
    $api_url = get_option('zdg_api_url', '');

    wp_localize_script('zdg-related-articles', 'zdgApi', array(
        'baseUrl' => get_rest_url(),
        'nonce'   => wp_create_nonce('wp_rest'),
        'apiUrl'  => $api_url, // Add the API URL
        'apiConfigured' => !empty($api_url) // Flag to indicate if API is configured
    ));
}
add_action('admin_enqueue_scripts', 'zdg_enqueue_scripts');

// Enqueue frontend styles following ZDG theme pattern
function zdg_enqueue_related_articles_styles() {
    // Only enqueue on singular post pages
    if (!is_singular('post')) {
        return;
    }
    
    $post_id = get_the_ID();
    $related_enabled = get_post_meta($post_id, 'zdg_related_enabled', true);
    
    // Only proceed if related articles are enabled for this post
    if (!$related_enabled) {
        return;
    }
    
    // Our plugin's fallback styles only load when necessary
    wp_enqueue_style(
        'zdg-related-articles-styles',
        plugins_url('assets/css/related-articles.css', __FILE__),
        array(),
        filemtime(plugin_dir_path(__FILE__) . 'assets/css/related-articles.css')
    );
    
    // // Add inline script to fix any styling issues after the theme has loaded
    // wp_add_inline_script('jquery', '
    //     jQuery(document).ready(function($) {
    //         // Ensure list items have consistent styling
    //         $(".zdg-related-articles .list-item").addClass("--featured-small");
            
    //         // Initialize any scripts that the theme might have for list items
    //         if (typeof initListItems === "function") {
    //             initListItems($(".zdg-related-articles .list-item"));
    //         }
    //     });
    // ');
}
add_action('wp_enqueue_scripts', 'zdg_enqueue_related_articles_styles', 999);

// Register meta fields
function zdg_register_meta() {
    register_post_meta('post', 'zdg_related_articles', array(
        'show_in_rest' => array(
            'schema' => array(
                'type'  => 'string',
                'description' => 'Lista de articole similare ca JSON string',
            ),
        ),
        'single'      => true,
        'type'        => 'string',
        'default'     => '[]',
        'auth_callback' => function() { 
            return current_user_can('edit_posts'); 
        },
        // Simplified sanitize callback - just ensure it's a valid string
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    register_post_meta('post', 'zdg_related_enabled', array(
        'show_in_rest'    => true,
        'single'          => true,
        'type'            => 'boolean',
        'default'         => false,
        'auth_callback'   => function() { return current_user_can('edit_posts'); },
        'sanitize_callback' => 'rest_sanitize_boolean',
    ));
}
add_action('init', 'zdg_register_meta');

// Custom API endpoint to get article by post name
add_action('rest_api_init', function () {
    register_rest_route('zdg-related-articles/v1', '/article-by-name', array(
        'methods' => 'GET',
        'callback' => 'zdg_get_article_by_post_name',
        'permission_callback' => function () {
            return current_user_can('edit_posts');
        }
    ));

    // Add endpoint for testing OpenSearch connection
    register_rest_route('zdg-related-articles/v1', '/test-opensearch', array(
        'methods' => 'GET',
        'callback' => 'zdg_test_opensearch_connection',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
    ));
});

function zdg_get_article_by_post_name($request) {
    $post_name = sanitize_text_field($request['post_name']);

    if (empty($post_name)) {
        return new WP_Error('empty_post_name', 'Post name is required.', array('status' => 400));
    }

    $args = array(
        'name' => $post_name,
        'post_type' => 'post',
        'posts_per_page' => 1,
    );

    $posts = get_posts($args);

    if (empty($posts)) {
        return null; // Article not found
    }

    $post = $posts[0];

    // Return the article data
    return array(
        'ID' => $post->ID,
        'title' => $post->post_title,
        'url' => get_permalink($post->ID),
        'date' => get_the_date('Y-m-d H:i:s', $post->ID),
        // You might need to fetch the score from your API or calculate it somehow
        'score' => 0.0,
    );
}

// Function to test the OpenSearch connection
function zdg_test_opensearch_connection() {
    $api_url = get_option('zdg_api_url', '');
    
    if (empty($api_url)) {
        return new WP_Error('api_not_configured', 'API URL is not configured', array('status' => 400));
    }
    
    $test_url = trailingslashit($api_url) . 'test_opensearch';
    $response = wp_remote_get($test_url, array('timeout' => 15));
    
    if (is_wp_error($response)) {
        return new WP_Error(
            'opensearch_connection_failed', 
            $response->get_error_message(), 
            array('status' => 500)
        );
    }
    
    $response_code = wp_remote_retrieve_response_code($response);
    $body = wp_remote_retrieve_body($response);
    
    if ($response_code === 200) {
        return array(
            'success' => true,
            'message' => 'OpenSearch connection successful',
            'details' => $body
        );
    } else {
        return new WP_Error(
            'opensearch_test_failed',
            'OpenSearch test failed with code ' . $response_code,
            array(
                'status' => $response_code,
                'response' => $body
            )
        );
    }
}

// Define plugin file constant for use in hooks
define('ZDG_RELATED_ARTICLES_FILE', __FILE__);

// Include required files
require_once plugin_dir_path(__FILE__) . 'includes/publish-hooks.php';
require_once plugin_dir_path(__FILE__) . 'includes/settings-page.php';
require_once plugin_dir_path(__FILE__) . 'includes/display-functions.php';
require_once plugin_dir_path(__FILE__) . 'includes/retry-handler.php';

