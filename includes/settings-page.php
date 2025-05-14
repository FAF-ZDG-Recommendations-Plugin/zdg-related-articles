<?php
/**
 * Settings page for ZDG Related Articles plugin
 * Handles API URL configuration
 */

// Exit if accessed directly
defined('ABSPATH') || exit;

// Enqueue admin styles for settings page
function zdg_admin_styles($hook) {
    if ('settings_page_zdg-related-articles' !== $hook) {
        return;
    }
    
    // Add inline styles
    wp_add_inline_style('admin-menu', '
        .zdg-latest-post {
            background: #f9f9f9;
            border-left: 4px solid #2271b1;
            padding: 12px 15px;
            margin-bottom: 20px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .zdg-indexed-info h3 {
            font-size: 16px;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        .zdg-index-post {
            margin-right: 5px !important;
        }
    ');
}
add_action('admin_enqueue_scripts', 'zdg_admin_styles');

// Function to get the latest indexed post from the API
function zdg_get_latest_indexed_post($api_url) {
    $endpoint = trailingslashit($api_url) . 'latest';
    $response = wp_remote_get($endpoint, array('timeout' => 15));
    
    if (is_wp_error($response)) {
        return array(
            'error' => true,
            'message' => $response->get_error_message()
        );
    }
    
    $response_code = wp_remote_retrieve_response_code($response);
    if ($response_code !== 200) {
        return array(
            'error' => true,
            'message' => "API responded with code {$response_code}"
        );
    }
    
    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);
    
    if (empty($data) || !is_array($data)) {
        return array(
            'error' => true,
            'message' => "Invalid or empty API response"
        );
    }
    
    // Parse the nested structure: [{"latest_article": {...}}, 200]
    if (isset($data[0]['latest_article']) && is_array($data[0]['latest_article'])) {
        return array(
            'error' => false,
            'data' => $data[0]['latest_article']
        );
    } else {
        return array(
            'error' => true,
            'message' => "Unexpected API response format"
        );
    }
}

// Function to get posts published after a certain date
function zdg_get_posts_after_date($date_string, $count_only = false) {
    // Convert ISO 8601 format (2025-02-24T22:09:36) to MySQL datetime format for proper comparison
    $formatted_date = '';
    if (!empty($date_string)) {
        $date_obj = date_create($date_string);
        if ($date_obj) {
            $formatted_date = date_format($date_obj, 'Y-m-d H:i:s');
        }
    }
    
    $args = array(
        'post_type' => 'post',
        'post_status' => 'publish',
        'orderby' => 'date',
        'order' => 'DESC',
        'date_query' => array(
            array(
                'after' => $formatted_date,
                'inclusive' => false,
            ),
        ),
    );
    
    // If we only want the count, we can be more efficient
    if ($count_only) {
        $args['posts_per_page'] = 1;
        $args['fields'] = 'ids';
        $args['no_found_rows'] = false;
    } else {
        $args['posts_per_page'] = 20;
    }
    
    $query = new WP_Query($args);
    
    // If we're only interested in count, return the found posts count
    if ($count_only) {
        return $query->found_posts;
    }
    
    return $query->posts;
}

// Register settings
function zdg_register_settings() {
    register_setting(
        'zdg_related_articles_settings',
        'zdg_api_url',
        array(
            'type' => 'string',
            'sanitize_callback' => 'sanitize_url'
        )
    );
}
add_action('admin_init', 'zdg_register_settings');

// Add settings page to menu
function zdg_add_settings_page() {
    add_options_page(
        'ZDG Related Articles Settings',  // Page title
        'ZDG Related Articles',           // Menu title
        'manage_options',                 // Capability
        'zdg-related-articles',           // Menu slug
        'zdg_render_settings_page'        // Callback function
    );
}
add_action('admin_menu', 'zdg_add_settings_page');

// Render the settings page
function zdg_render_settings_page() {
    // Check user capabilities
    if (!current_user_can('manage_options')) {
        return;
    }
      // Get the saved API URL (no default)
    $api_url = get_option('zdg_api_url', '');
    $api_configured = !empty($api_url);
    
    // Save settings if form is submitted
    if (isset($_POST['zdg_save_settings']) && check_admin_referer('zdg_settings_nonce')) {
        $new_api_url = isset($_POST['zdg_api_url']) ? sanitize_url($_POST['zdg_api_url']) : '';
        update_option('zdg_api_url', $new_api_url);
        $api_url = $new_api_url;
          // Show success message
        echo '<div class="notice notice-success is-dismissible"><p>Setările au fost salvate cu succes!</p></div>';
    }
    
    // Test API connection if requested
    $test_message = '';
    if (isset($_POST['zdg_test_api']) && check_admin_referer('zdg_settings_nonce')) {
        $test_url = trailingslashit($api_url) . 'test';
        $response = wp_remote_get($test_url, array(
            'timeout' => 15
        ));
        
        if (is_wp_error($response)) {
            $test_message = '<div class="notice notice-error"><p>Conexiunea API a eșuat: ' . esc_html($response->get_error_message()) . '</p></div>';
        } else {
            $response_code = wp_remote_retrieve_response_code($response);
            $body = wp_remote_retrieve_body($response);
            
            if ($response_code === 200) {
                $test_message = '<div class="notice notice-success"><p>Conexiunea API reușită! Răspuns: ' . esc_html($body) . '</p></div>';
            } else {
                $test_message = '<div class="notice notice-warning"><p>API-ul a răspuns cu codul ' . esc_html($response_code) . '. Răspuns: ' . esc_html($body) . '</p></div>';
            }
        }
    }
      // Test OpenSearch connection if requested
    if (isset($_POST['zdg_test_opensearch']) && check_admin_referer('zdg_settings_nonce')) {
        if (empty($api_url)) {
            $test_message = '<div class="notice notice-error"><p>URL-ul API nu este configurat. Vă rugăm să configurați URL-ul API mai întâi.</p></div>';
        } else {
            $test_url = get_rest_url(null, 'zdg-related-articles/v1/test-opensearch');
            $response = wp_remote_get($test_url, array(
                'timeout' => 15,
                'headers' => array(
                    'X-WP-Nonce' => wp_create_nonce('wp_rest')
                )
            ));
            
            if (is_wp_error($response)) {
                $test_message = '<div class="notice notice-error"><p>Conexiunea OpenSearch a eșuat: ' . esc_html($response->get_error_message()) . '</p></div>';
            } else {
                $response_code = wp_remote_retrieve_response_code($response);
                $body = wp_remote_retrieve_body($response);
                $data = json_decode($body, true);
                
                if ($response_code === 200 && isset($data['success']) && $data['success']) {
                    $message = isset($data['message']) ? $data['message'] : 'Connection successful';
                    $details = isset($data['details']) ? ': ' . $data['details'] : '';
                    $test_message = '<div class="notice notice-success"><p>Conexiunea OpenSearch reușită! ' . esc_html($message) . esc_html($details) . '</p></div>';
                } else {                    $error_msg = isset($data['message']) ? $data['message'] : 'Eroare necunoscută';
                    $test_message = '<div class="notice notice-warning"><p>Testul OpenSearch a eșuat cu codul ' . esc_html($response_code) . '. Eroare: ' . esc_html($error_msg) . '</p></div>';
                }
            }
        }
    }
    
    // Get the latest indexed post from the API
    $latest_indexed = zdg_get_latest_indexed_post($api_url);
    
    // Prepare the HTML for displaying the latest indexed post and unindexed posts
    $indexed_html = '';
    if (!$latest_indexed['error']) {
        // Format the information about the latest indexed post
        $latest_post = $latest_indexed['data'];
        $indexed_date = isset($latest_post['date']) ? $latest_post['date'] : '';
        
        $indexed_html .= '<div class="zdg-indexed-info">';
        $indexed_html .= '<h3>Ultimul Articol Indexat</h3>';
        $indexed_html .= '<div class="zdg-latest-post">';        $indexed_html .= '<strong>Titlu:</strong> ' . esc_html($latest_post['title']) . '<br>';
        $indexed_html .= '<strong>ID:</strong> ' . esc_html($latest_post['ID']) . '<br>';
        $indexed_html .= '<strong>Data:</strong> ' . esc_html($indexed_date) . '<br>';
        $indexed_html .= '<strong>URL:</strong> <a href="' . esc_url($latest_post['url']) . '" target="_blank">' . esc_url($latest_post['url']) . '</a><br>';
        $indexed_html .= '</div>';
          // Get the total count of unindexed posts
        $total_unindexed = zdg_get_posts_after_date($indexed_date, true);
        
        // Get posts published after the latest indexed post (paginated)
        $recent_posts = zdg_get_posts_after_date($indexed_date);
        
        if (!empty($recent_posts)) {            
            $indexed_html .= '<h3>Articole Neindexate</h3>';
            $indexed_html .= '<p><strong>' . esc_html($total_unindexed) . '</strong> articole au fost publicate de la ultimul articol indexat.</p>';
              // Add Index All button if there's more than one post
            if ($total_unindexed > 1) {
                $indexed_html .= '<div style="margin-bottom: 15px;">';
                $indexed_html .= '<button type="button" id="zdg-index-all" class="button button-primary" data-total="' . esc_attr($total_unindexed) . '" data-date="' . esc_attr($indexed_date) . '">Indexează Toate cele ' . esc_html($total_unindexed) . ' Articole</button>';
                $indexed_html .= ' <span id="zdg-index-all-status" style="margin-left: 10px; display: none;"></span>';
                $indexed_html .= '</div>';
            }
            
            $indexed_html .= '<p>Se afișează cele mai recente ' . count($recent_posts) . ' articole care trebuie indexate:</p>';
            $indexed_html .= '<table class="widefat striped">';
            $indexed_html .= '<thead><tr><th>ID</th><th>Titlu</th><th>Data Publicării</th><th>Acțiuni</th></tr></thead><tbody>';
            
            foreach ($recent_posts as $post) {
                $post_date = get_the_date('Y-m-d H:i:s', $post->ID);
                $indexed_html .= '<tr>';
                $indexed_html .= '<td>' . esc_html($post->ID) . '</td>';
                $indexed_html .= '<td>' . esc_html($post->post_title) . '</td>';
                $indexed_html .= '<td>' . esc_html($post_date) . '</td>';                
                $indexed_html .= '<td>';                $indexed_html .= '<button type="button" class="button zdg-index-post" data-post-id="' . esc_attr($post->ID) . '">Indexează/Actualizează Acum</button>';
                $indexed_html .= ' <a href="' . esc_url(get_permalink($post->ID)) . '" target="_blank" class="button button-secondary">Vezi Articolul</a>';
                $indexed_html .= '</td>';
                $indexed_html .= '</tr>';
            }
            
            $indexed_html .= '</tbody></table>';
            // Add JavaScript for handling the "Index Now" and "Index All" button clicks
            $indexed_html .= '<script>
            jQuery(document).ready(function($) {
                // Handler for individual post indexing
                $(".zdg-index-post").on("click", function() {
                    var postId = $(this).data("post-id");
                    var btn = $(this);
                      // Disable the button and show loading state
                    btn.prop("disabled", true).text("Se indexează...");
                    
                    // Make an AJAX request to index the post
                    $.ajax({
                        url: ajaxurl,
                        type: "POST",
                        data: {
                            action: "zdg_manual_index_post",
                            post_id: postId,
                            force_update: true, // Force update for manual indexing
                            nonce: "' . wp_create_nonce('zdg_index_post_nonce') . '"
                        },
                        success: function(response) {                            if (response.success) {
                                btn.removeClass("button").addClass("button-primary").text("Indexat");
                                // Optionally remove the row after a delay
                                setTimeout(function() {
                                    btn.closest("tr").fadeOut(500, function() { $(this).remove(); });
                                }, 2000);
                            } else {
                    btn.text("Eșuat");
                                alert("Eroare: " + response.data.message);
                                setTimeout(function() {
                                    btn.prop("disabled", false).text("Încearcă din nou");
                                }, 2000);
                            }
                        },
                        error: function() {                            btn.text("Eroare");
                            alert("A apărut o eroare în timpul încercării de indexare a articolului.");
                            setTimeout(function() {
                                btn.prop("disabled", false).text("Încearcă din nou");
                            }, 2000);
                        }
                    });
                });
                
                // Handler for the "Index All Posts" button
                $("#zdg-index-all").on("click", function() {
                    var btn = $(this);
                    var statusElem = $("#zdg-index-all-status");
                    var totalPosts = parseInt(btn.data("total"));
                    
                    // Dynamically adjust batch size based on total number of posts
                    var batchSize = 5; // Default batch size
                    
                    // For large numbers of posts, use bigger batches to speed up the process
                    if (totalPosts > 500) {
                        batchSize = 20;
                    } else if (totalPosts > 100) {
                        batchSize = 10;
                    }
                    
                    var processed = 0;
                    var successful = 0;
                    var failed = 0;
                      // Confirm before proceeding
                    if (!confirm("Sigur doriți să indexați toate cele " + totalPosts + " articole? Acest proces poate dura câteva minute.")) {
                        return;
                    }
                    
                    // Disable button and show status
                    btn.prop("disabled", true).text("Indexare în curs (0/" + totalPosts + ")...");
                    statusElem.text("Se pregătește indexarea pentru " + totalPosts + " articole...").show();
                    
                    // Function to process posts in batches
                    function processBatch(offset) {
                        $.ajax({
                            url: ajaxurl,
                            type: "POST",
                            data: {
                                action: "zdg_batch_index_posts",
                                offset: offset,
                                batch_size: batchSize,
                                date_after: btn.data("date"),
                                nonce: "' . wp_create_nonce('zdg_index_post_nonce') . '"
                            },
                            success: function(response) {
                                if (response.success) {
                                    // Update counts
                                    processed += response.data.processed;
                                    successful += response.data.successful;
                                    failed += response.data.failed;
                                    
                                    // Update status display
                                    var percent = Math.round((processed / totalPosts) * 100);
                                      // Update button text
                                    btn.text("Indexare în curs (" + processed + "/" + totalPosts + ")...");
                                    
                                    statusElem.html(
                                        "<div style=\"margin: 10px 0;\">" +
                                        "<div class=\"progress-bar\" style=\"background-color: #f0f0f0; border-radius: 3px; height: 20px; width: 100%; margin-bottom: 5px;\">" +
                                        "<div style=\"background-color: #2271b1; height: 20px; width: " + percent + "%; border-radius: 3px; text-align: center; color: white; line-height: 20px;\">" + percent + "%</div>" +
                                        "</div>" +                                        "Progres: " + processed + "/" + totalPosts + " articole<br>" +
                                        "Succes: <span style=\"color: green;\">" + successful + "</span>, Eșuat: <span style=\"color: " + (failed > 0 ? "red" : "#666") + ";\">" + failed + "</span>"+
                                        "</div>"
                                    );
                                    
                                    // If there are more posts to process
                                    if (processed < totalPosts && response.data["continue"]) {
                                        // Process next batch
                                        processBatch(offset + batchSize);
                                    } else {                                        // All done
                                        btn.text("Indexare Completă");
                                        statusElem.html(
                                            "<div style=\"margin: 10px 0; padding: 10px; border-left: 4px solid green; background-color: #f0f8f0;\">" +
                                            "<strong>Finalizat!</strong><br>" +
                                            "Total procesate: " + processed + " articole<br>" +
                                            "Indexate cu succes: <span style=\"color: green;\">" + successful + "</span> articole<br>" +
                                            (failed > 0 ? "Eșuate: <span style=\"color: red;\">" + failed + "</span> articole<br>" : "") +
                                            "<a href=\"#\" class=\"refresh-link\">Reîmprospătează pagina</a> pentru a vedea starea actualizată. Reîmprospătare automată în <span class=\"refresh-countdown\">5</span> secunde." +
                                            "</div>"
                                        );
                                        // Reload the page after a delay to show updated status
                                        var countdownSeconds = 5;
                                        var countdownTimer = setInterval(function() {
                                            countdownSeconds--;
                                            if (countdownSeconds <= 0) {
                                                clearInterval(countdownTimer);
                                                location.reload();
                                            } else {
                                                statusElem.find(".refresh-countdown").text(countdownSeconds);
                                            }
                                        }, 1000);
                                        
                                        statusElem.find(".refresh-link").on("click", function(e) {
                                            e.preventDefault();
                                            clearInterval(countdownTimer);
                                            location.reload();
                                        });
                                    }
                                } else {                                    // Error occurred
                                    btn.text("A apărut o eroare");
                                    statusElem.html("Eroare: " + response.data.message + "<br>S-au procesat " + processed + " articole înainte de eroare.");
                                }
                            },
                            error: function() {                                btn.text("Eroare de Conexiune");
                                statusElem.html("A apărut o eroare de conexiune. Vă rugăm să încercați din nou mai târziu.<br>S-au procesat " + processed + " articole înainte de eroare.");
                            }
                        });
                    }
                    
                    // Start the first batch
                    processBatch(0);
                });
            });
            </script>';
        } else {                        $indexed_html .= '<p>Toate articolele sunt indexate și actualizate!</p>';
        }
        
        $indexed_html .= '</div>';
    } else {
        $indexed_html .= '<div class="notice notice-warning inline"><p>Nu s-a putut obține ultimul articol indexat: ' . esc_html($latest_indexed['message']) . '</p></div>';
    }
    
    ?>    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
          <?php if (empty($api_url)): ?>
        <div class="notice notice-warning">
            <p><strong>Atenție:</strong> API URL nu este configurat. Vă rugăm să configurați API URL pentru ca funcționalitățile de articole similare să funcționeze corect.</p>
        </div>
        <?php endif; ?>        
        <?php if (!empty($api_url) && isset($total_unindexed) && $total_unindexed > 1): ?>
        <div class="notice notice-info is-dismissible">
            <p><strong>Atenţie:</strong> Există <?php echo esc_html($total_unindexed); ?> articole care nu au fost încă indexate. Folosiți butonul "Indexează Toate" din secțiunea Stare Indexare pentru a indexa toate articolele simultan.</p>
        </div>
        <?php endif; ?>
        
        <?php echo $test_message; ?>
        
        <form method="post" action="">
            <?php wp_nonce_field('zdg_settings_nonce'); ?>
            <table class="form-table">
                <tr>
                    <th scope="row">
                        <label for="zdg_api_url">API URL</label>
                    </th>
                    <td>
                        <input type="url" name="zdg_api_url" id="zdg_api_url" 
                            value="<?php echo esc_attr($api_url); ?>" 
                            class="regular-text"
                            placeholder="https://api.example.com/api/"
                            required>                        <p class="description">
                            Introduceți URL-ul de bază pentru API-ul de recomandări (cu slash la sfârșit).
                            Exemplu: <code>http://localhost:5000/api/</code> pentru dezvoltare locală sau
                            <code>https://your-domain.com/api/</code> pentru producție.
                        </p>
                    </td>
                </tr>
            </table>
            <div style="display: flex; gap: 10px; margin-top: 20px;">                <button type="submit" name="zdg_save_settings" class="button button-primary">
                    Salvează Setările
                </button>                <button type="submit" name="zdg_test_api" class="button button-secondary">
                    Testează Conexiunea API
                </button>
                <button type="submit" name="zdg_test_opensearch" class="button button-secondary">
                    Testează OpenSearch
                </button>
            </div>
        </form>
          <hr style="margin: 30px 0;">
        
        <h2>Stare Index</h2>
        <?php echo $indexed_html; ?>

        <hr style="margin: 30px 0;">
        
        <h2>Încercări de Indexare Eșuate</h2>
        <?php 
        $failed_attempts = zdg_get_failed_indexing_attempts();
        if (!empty($failed_attempts)): 
            $failed_count = count($failed_attempts);
        ?>
            <div class="notice notice-warning inline">
                <p><strong>Atenție:</strong> Există <?php echo esc_html($failed_count); ?> articole care nu au putut fi indexate și necesită atenție.</p>
            </div>
            
            <div style="margin: 15px 0;">
                <button type="button" id="zdg-retry-all-failed" class="button button-primary">Reîncearcă Toate (<?php echo esc_html($failed_count); ?>)</button>
                <button type="button" id="zdg-check-api" class="button button-secondary" style="margin-left: 10px;">Verifică Conexiunea API</button>
                <span id="zdg-retry-status" style="margin-left: 10px; display: none;"></span>
            </div>            
            <table class="widefat striped">
                <thead>
                    <tr>
                        <th>ID Articol</th>
                        <th>Titlu</th>
                        <th>Prima Încercare</th>
                        <th>Ultima Încercare</th>
                        <th>Încercări</th>
                        <th>Mesaj Eroare</th>
                        <th>Acțiuni</th>
                    </tr>
                </thead>
                <tbody id="zdg-failed-attempts-list">
                    <?php foreach ($failed_attempts as $attempt): ?>
                    <tr data-post-id="<?php echo esc_attr($attempt['post_id']); ?>">
                        <td><?php echo esc_html($attempt['post_id']); ?></td>
                        <td><?php echo esc_html($attempt['post_title']); ?></td>
                        <td><?php echo esc_html(date('Y-m-d H:i:s', $attempt['first_attempt'])); ?></td>
                        <td><?php echo esc_html(date('Y-m-d H:i:s', $attempt['last_attempt'])); ?></td>
                        <td><?php echo esc_html($attempt['attempt_count']); ?></td>
                        <td><?php echo esc_html($attempt['error_message']); ?></td>
                        <td>
                            <button type="button" class="button zdg-retry-post" data-post-id="<?php echo esc_attr($attempt['post_id']); ?>">Reîncearcă</button>
                            <a href="<?php echo esc_url(get_permalink($attempt['post_id'])); ?>" target="_blank" class="button button-secondary">Vizualizare</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>

            <script>
            jQuery(document).ready(function($) {
                // Single post retry handler
                $(".zdg-retry-post").on("click", function() {
                    var postId = $(this).data("post-id");
                    var btn = $(this);
                      // Disable the button and show loading state
                    btn.prop("disabled", true).text("Se reîncearcă...");
                    
                    // Make an AJAX request to index the post
                    $.ajax({
                        url: ajaxurl,
                        type: "POST",
                        data: {
                            action: "zdg_manual_index_post",
                            post_id: postId,
                            force_update: true,
                            nonce: "<?php echo wp_create_nonce('zdg_index_post_nonce'); ?>"
                        },
                        success: function(response) {
                            if (response.success) {
                                // Remove the row on success
                                btn.closest("tr").fadeOut(500, function() { 
                                    $(this).remove(); 
                                    
                                    // Update count and check if table is empty
                                    updateFailedAttemptsCount();
                                });
                            } else {                                
                                btn.text("Eșuat");
                                alert("Eroare: " + response.data.message);
                                setTimeout(function() {
                                    btn.prop("disabled", false).text("Reîncearcă");
                                }, 2000);
                            }
                        },
                        error: function() {                            
                            btn.text("Eroare");
                            alert("A apărut o eroare în timpul încercării de indexare a articolului.");
                            setTimeout(function() {
                                btn.prop("disabled", false).text("Reîncearcă");
                            }, 2000);
                        }
                    });
                });
                
                // Update the count of failed attempts
                function updateFailedAttemptsCount() {
                    var remainingRows = $("#zdg-failed-attempts-list tr").length;
                      if (remainingRows === 0) {
                        // No more failures, hide the section
                        $("#zdg-failed-attempts-list").closest("table").before(
                            '<div class="notice notice-success inline"><p>Toate articolele eșuate au fost indexate cu succes!</p></div>'
                        ).hide();
                        
                        $("#zdg-retry-all-failed, #zdg-check-api").hide();
                    } else {
                        // Update the count in the retry all button
                        $("#zdg-retry-all-failed").text("Reîncearcă Toate (" + remainingRows + ")");
                    }
                }
                
                // Retry all failed posts handler
                $("#zdg-retry-all-failed").on("click", function() {
                    var btn = $(this);
                    var statusElem = $("#zdg-retry-status");
                    var postIds = [];
                    
                    // Get all post IDs from the table
                    $("#zdg-failed-attempts-list tr").each(function() {
                        postIds.push($(this).data("post-id"));
                    });
                    
                    var totalPosts = postIds.length;
                    var processed = 0;
                    var successful = 0;
                    var failed = 0;
                    
                    if (totalPosts === 0) {
                        return;
                    }
                      // Confirm before proceeding
                    if (!confirm("Sigur doriți să reîncercați toate cele " + totalPosts + " articole eșuate?")) {
                        return;
                    }
                    
                    // Disable button and show status
                    btn.prop("disabled", true).text("Reîncercare în curs...");
                    statusElem.text("Se pregătește reîncercarea pentru " + totalPosts + " articole...").show();
                    
                    // Function to process each post one by one
                    function processPost(index) {                        if (index >= postIds.length) {
                            // All done
                            btn.text("Reîncercare Completă");
                            
                            if (failed === 0) {
                                statusElem.html(
                                    "<div style=\"margin: 10px 0; padding: 10px; border-left: 4px solid green; background-color: #f0f8f0;\">" +
                                    "<strong>Finalizat!</strong> Toate articolele au fost indexate cu succes.<br>" +
                                    "<a href=\"#\" class=\"refresh-link\">Reîmprospătează pagina</a> pentru a vedea starea actualizată." +
                                    "</div>"
                                );
                            } else {
                                statusElem.html(
                                    "<div style=\"margin: 10px 0; padding: 10px; border-left: 4px solid orange; background-color: #fff8f0;\">" +
                                    "<strong>Parțial Finalizat!</strong><br>" +
                                    "Succes: <span style=\"color: green;\">" + successful + "</span> articole<br>" +
                                    "Eșuat: <span style=\"color: red;\">" + failed + "</span> articole<br>" +
                                    "<a href=\"#\" class=\"refresh-link\">Reîmprospătează pagina</a> pentru a vedea starea actualizată." +
                                    "</div>"
                                );
                            }
                            
                            statusElem.find(".refresh-link").on("click", function(e) {
                                e.preventDefault();
                                location.reload();
                            });
                            
                            return;
                        }
                        
                        var postId = postIds[index];
                        var percent = Math.round((index / postIds.length) * 100);
                        
                        statusElem.html(                            "<div style=\"margin: 10px 0;\">" +
                            "<div class=\"progress-bar\" style=\"background-color: #f0f0f0; border-radius: 3px; height: 20px; width: 100%; margin-bottom: 5px;\">" +
                            "<div style=\"background-color: #2271b1; height: 20px; width: " + percent + "%; border-radius: 3px; text-align: center; color: white; line-height: 20px;\">" + percent + "%</div>" +
                            "</div>" +
                            "Procesare articol ID: " + postId + " (" + (index + 1) + "/" + totalPosts + ")" +
                            "</div>"
                        );
                        
                        // Send request for this post
                        $.ajax({
                            url: ajaxurl,
                            type: "POST",
                            data: {
                                action: "zdg_manual_index_post",
                                post_id: postId,
                                force_update: true,
                                nonce: "<?php echo wp_create_nonce('zdg_index_post_nonce'); ?>"
                            },
                            success: function(response) {
                                processed++;
                                
                                if (response.success) {
                                    successful++;
                                    // Remove row from table
                                    $("#zdg-failed-attempts-list tr[data-post-id='" + postId + "']").fadeOut(200, function() { 
                                        $(this).remove(); 
                                    });
                                } else {
                                    failed++;
                                }
                                
                                // Process next post
                                setTimeout(function() {
                                    processPost(index + 1);
                                }, 500);
                            },
                            error: function() {
                                processed++;
                                failed++;
                                
                                // Process next post
                                setTimeout(function() {
                                    processPost(index + 1);
                                }, 500);
                            }
                        });
                    }
                    
                    // Start processing
                    processPost(0);
                });
                  // Check API connection
                $("#zdg-check-api").on("click", function() {
                    var btn = $(this);
                    var statusElem = $("#zdg-retry-status");
                    
                    btn.prop("disabled", true).text("Verificare API...");
                    statusElem.text("Se testează conexiunea API...").show();
                    
                    $.ajax({
                        url: ajaxurl,
                        type: "POST",
                        data: {
                            action: "zdg_check_api_connection",
                            nonce: "<?php echo wp_create_nonce('zdg_index_post_nonce'); ?>"
                        },
                        success: function(response) {
                            if (response.success) {
                                statusElem.html(                                    "<div class=\"notice notice-success inline\" style=\"margin: 10px 0;\">" +
                                    "<p><strong>API-ul este disponibil!</strong> Puteți reîncerca articolele eșuate acum.</p>" +
                                    "</div>"
                                );
                            } else {
                                statusElem.html(                                    "<div class=\"notice notice-error inline\" style=\"margin: 10px 0;\">" +
                                    "<p><strong>API-ul nu este disponibil.</strong> Eroare: " + response.data.message + "</p>" +
                                    "</div>"
                                );
                            }
                              setTimeout(function() {
                                btn.prop("disabled", false).text("Verifică Conexiunea API");
                            }, 2000);
                        },
                        error: function() {                            statusElem.html(
                                "<div class=\"notice notice-error inline\" style=\"margin: 10px 0;\">" +
                                "<p><strong>Eroare de conexiune.</strong> Nu s-a putut conecta la server.</p>" +
                                "</div>"
                            );
                            
                            setTimeout(function() {
                                btn.prop("disabled", false).text("Verifică Conexiunea API");
                            }, 2000);
                        }
                    });
                });
            });
            </script>
        <?php else: ?>            <div class="notice notice-success inline">
                <p>Nu au fost înregistrate încercări de indexare eșuate.</p>
            </div>
        <?php endif; ?>
    </div>
    <?php
}