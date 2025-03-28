<?php
/**
 * Plugin Name: ZDG Related Articles
 * Description: Adds a related articles section at the end of articles and a panel to the post editor sidebar for customization.
 * Version: 1.0
 * Author: Alexandru Buzu
 */

defined('ABSPATH') || exit;

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

// Indexarea articolului la publicare
function zdg_index_article( $new_status, $old_status, $post ) {
    if ( 'publish' !== $new_status || 'publish' === $old_status ) {
        return;
    }
    if ( 'post' !== $post->post_type ) {
        return;
    }
    // Apel API pentru indexare aici
    error_log( "Indexare articol ID " . $post->ID );
}
add_action('transition_post_status', 'zdg_index_article', 10, 3);
