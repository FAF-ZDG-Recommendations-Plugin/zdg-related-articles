<?php
// Render related articles at the end of the content using the ZDG theme structure
function zdg_display_related_articles($content) {
    // Only display on singular post pages.
    if (!is_singular('post')) {
        return $content;
    }

    $post_id = get_the_ID();
    $related_enabled = get_post_meta($post_id, 'zdg_related_enabled', true);
    if (!$related_enabled) {
        return $content;
    }

    $related_articles_json = get_post_meta($post_id, 'zdg_related_articles', true);
    $related_articles_ids = json_decode($related_articles_json, true);
    if (empty($related_articles_ids)) {
        return $content;
    }

    // Updated markup to align with ZDG theme list structure.
    $related_html  = '<div class="related-posts content-element">'; // use theme's related posts classes
    $related_html .= '<div class="inner-section__title"><h2 class="heading-32 --bold --black1">Citește și</h2></div>';
    $related_html .= '<div class="loop-grid">'; // grid container without inline styles

    foreach ($related_articles_ids as $article_id) {
        // Set up the global post data to leverage the theme templates.
        $post_obj = get_post($article_id);
        if ($post_obj) {
            $original_post = $GLOBALS['post'];
            $GLOBALS['post'] = $post_obj;
            setup_postdata($post_obj);
            // Set image size argument to match theme's preferred size.
            $args = array('zdg_image_size' => 'medium');
            ob_start();
            // Load a modified list-item template that does not include the article image.
            $template_path = locate_template('templates/components/list-item-noimage.php');
            if ($template_path) {
                include($template_path);
            } else {
                // Fallback template located within the plugin.
                include(plugin_dir_path(__FILE__) . '../templates/list-item-noimage.php');
            }
            $related_html .= ob_get_clean();
            $GLOBALS['post'] = $original_post;
            wp_reset_postdata();
        }
    }

    $related_html .= '</div>'; // Close .loop-grid
    $related_html .= '</div>'; // Close .container

    return $content . $related_html;
}
add_filter('the_content', 'zdg_display_related_articles');

// Fallback simulated function to retrieve article data.
function zdg_get_article_data($article_id) {
    $default_articles = [
        1 => [
            'title' => 'Cum tehnologia influențează economia locală',
            'link'  => 'https://example.com/article1',
            'date'  => '01.10.2023',
            'image' => 'https://via.placeholder.com/350x200/008000/FFFFFF?text=ZDG'
        ],
        2 => [
            'title' => 'Tendințele modei în 2023: Ce să alegeți',
            'link'  => 'https://example.com/article2',
            'date'  => '02.10.2023',
            'image' => 'https://via.placeholder.com/350x200/008000/FFFFFF?text=ZDG'
        ],
        3 => [
            'title' => 'Impactul schimbărilor climatice asupra agriculturii',
            'link'  => 'https://example.com/article3',
            'date'  => '28.09.2023',
            'image' => 'https://via.placeholder.com/350x200/008000/FFFFFF?text=ZDG'
        ],
        4 => [
            'title' => 'Inovații în domeniul sănătății: Noi soluții medicale',
            'link'  => 'https://example.com/article4',
            'date'  => '03.10.2023',
            'image' => 'https://via.placeholder.com/350x200/008000/FFFFFF?text=ZDG'
        ],
        5 => [
            'title' => 'Povești inspiraționale din lumea afacerilor',
            'link'  => 'https://example.com/article5',
            'date'  => '30.09.2023',
            'image' => 'https://via.placeholder.com/350x200/008000/FFFFFF?text=ZDG'
        ],
    ];
    return isset($default_articles[$article_id]) ? $default_articles[$article_id] : null;
}
