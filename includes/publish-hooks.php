<?php
// Function to index article at publishing
function zdg_index_article( $new_status, $old_status, $post ) {
    if ( 'publish' !== $new_status || 'publish' === $old_status ) {
        return;
    }
    if ( 'post' !== $post->post_type ) {
        return;
    }
    // Placeholder: Call API to index the article here.
    error_log( "Indexare articol ID " . $post->ID );
}

// Hook the function to the transition_post_status action
add_action('transition_post_status', 'zdg_index_article', 10, 3);