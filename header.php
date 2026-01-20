<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php wp_title( '|', true, 'right' ); ?></title>

    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<div class="toc-sidebar-container">
<button id="toc-open-btn" class="toc-open-btn">
    <span class="toc-open-btn-icon">&#9776;</span> </button>

    <nav id="toc-sidebar" class="toc-sidebar">
        <div class="toc-sidebar-header">
            <h4>On This Page</h4>
            <button id="toc-close-btn" class="toc-close-btn">&times;</button>
        </div>
        <ul id="toc-list">
            </ul>
    </nav>

    <div id="toc-overlay" class="toc-overlay"></div>
</div>

<nav class="navbar">
        <div class="logo">
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>">
                <img src="https://images.squarespace-cdn.com/content/669519c2211c380d6b3ae69a/9365f11d-0978-415f-8bf5-cc2d371b41f6/transparent+smaller+logo.png?content-type=image%2Fpng" alt="The Cutting Edge Logo">
            </a>
        </div>
        <button class="mobile-menu-toggle" aria-label="Toggle Menu" aria-expanded="false">
            &#9776; </button>
        
<ul class="menu">
    <li class="menu-item has-multilevel">
        Study Notes <span class="arrow-down">▼</span>
        
        <ul class="dropdown-menu">
            
            <li class="nested-dropdown-parent">
                <a href="#">Upper GI <span class="desktop-arrow">▸</span></a>
                <ul class="submenu-level-2">
                    <li><a href="https://www.cuttingedge.education/spleen">Spleen</a></li>
                    <li><a href="https://www.cuttingedge.education/oesophagus">Oesophagus</a></li>
                    <li><a href="https://www.cuttingedge.education/stomach">Stomach</a></li>
                    <li><a href="https://www.cuttingedge.education/duodenum">Duodenum</a></li>
                </ul>
            </li>

            <li class="nested-dropdown-parent">
                <a href="#">HPB <span class="desktop-arrow">▸</span></a>
                <ul class="submenu-level-2">
                    <li><a href="https://www.cuttingedge.education/liver">Liver</a></li>
                    <li><a href="https://www.cuttingedge.education/pancreas">Pancreas</a></li>
                    <li><a href="https://www.cuttingedge.education/gallbladder">Gall Bladder</a></li>
                </ul>
            </li>

            <li class="nested-dropdown-parent">
                <a href="#">Colorectal <span class="desktop-arrow">▸</span></a>
                <ul class="submenu-level-2">
                    <li><a href="https://www.cuttingedge.education/Colon">Colon</a></li>
                    <li><a href="https://www.cuttingedge.education/Rectum">Rectum</a></li>
                    <li><a href="https://www.cuttingedge.education/Anus">Anus</a></li>
                </ul>
            </li>

            <li class="nested-dropdown-parent">
                <a href="#">General Surgery <span class="desktop-arrow">▸</span></a>
                <ul class="submenu-level-2">
                    <li><a href="https://www.cuttingedge.education/gallbladder">Appendix</a></li>
                    <li><a href="https://www.cuttingedge.education/smallbowel">Small Bowel</a></li>
                    <li><a href="https://www.cuttingedge.education/spleen">Spleen</a></li>
                </ul>
            </li>
        </ul>
    </li>

    <li class="menu-item">
        <a href="https://cuttingedge.education/mrcs-question-bank/" style="text-decoration: none; color: inherit; display: block; height: 100%; width: 100%;">
            MRCS Question Bank
        </a>
    </li>
</ul>
        
        <div class="nav-user-actions">
            <?php if ( is_user_logged_in() ) : ?>

                <?php 
                    $current_user = wp_get_current_user();
                    $display_name = $current_user->display_name;
                    if ( empty($display_name) ) {
                        $display_name = $current_user->user_login;
                    }
                ?>
                
                <span class="nav-user-welcome">
                    Welcome, <?php echo esc_html( $display_name ); ?>
                </span>
                <a class="nav-logout-link" href="<?php echo esc_url( um_get_core_page( 'logout' ) ); ?>">Log Out</a>
                
            <?php else : ?>
                
                <button id="login-popup-trigger" class="nav-login-trigger" type="button">Log In</button>
                
                <a class="nav-signup-btn" href="<?php echo esc_url( um_get_core_page( 'register' ) ); ?>">Sign Up</a>
                
            <?php endif; ?>
        </div>
        
    </nav>

<?php if ( ! is_user_logged_in() ) : ?>
    <div class="login-popup-modal" id="login-popup-modal" style="display: none;">
        
        <div class="modal-overlay"></div>
        
        <div class="login-card-wrapper">
            <span class="modal-close" id="login-popup-close">&times;</span>
            
            <div class="login-card-logo">
                <img src="https://images.squarespace-cdn.com/content/669519c2211c380d6b3ae69a/9365f11d-0978-415f-8bf5-cc2d371b41f6/transparent+smaller+logo.png?content-type=image%2Fpng" alt="Cutting Edge Logo">
            </div>

            <div class="login-card-header">
                <h3>Welcome to Cutting Edge</h3>
                <p>Log in to access your notes, practice bank, and progress tracker.</p>
            </div>

            <div class="login-card-form">
                
                <?php echo do_shortcode('[ultimatemember form_id="497"]'); ?>
                
            </div>
        </div>

    </div>
<?php endif; ?>