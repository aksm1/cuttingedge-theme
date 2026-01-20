<?php get_header(); ?>

<main id="main-content" class="site-main">

    <?php
    // Start the WordPress Loop.
    if ( have_posts() ) :
        while ( have_posts() ) :
            the_post();

            // This function displays the content you type into the WordPress page editor.
            the_content();

        endwhile;
    else :
        // If no content is found, show a message.
        echo '<p>Sorry, no content found.</p>';
    endif;
    ?>

</main> <?php get_footer(); ?>