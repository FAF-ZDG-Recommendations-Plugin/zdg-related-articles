<?php
/**
 * Fallback template for list items without an image.
 * This template is used when the theme does not provide its own version.
 */
?>
<article class="list-item --featured-small">
    <div class="list-item__text">
        <h4 class="list-item__title">
            <a href="<?php the_permalink(); ?>" class="list-item__link-inner">
                <?php the_custom_title(); ?>
            </a>
        </h4>
        <?php the_custom_meta(); ?>
    </div>
</article>
