<?php
/**
 * Theme Functions - MRCS Question Bank
 * VERSION: STABLE (Fixed: Ghost Data Removal & Animation Sync)
 */

// =============================================================================
// 1. DATABASE SETUP
// =============================================================================
add_action('init', 'mrcs_check_and_create_table');
function mrcs_check_and_create_table() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'mrcs_user_progress';
    if( $wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name ) {
        $charset_collate = $wpdb->get_charset_collate();
        $sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            user_id bigint(20) NOT NULL,
            question_id bigint(20) NOT NULL,
            quiz_session_id varchar(50) DEFAULT '', 
            is_correct tinyint(1) DEFAULT 0 NOT NULL,
            user_answer varchar(10) DEFAULT '' NOT NULL,
            attempt_time datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
            PRIMARY KEY  (id),
            KEY user_id (user_id),
            KEY question_id (question_id)
        ) $charset_collate;";
        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
        dbDelta( $sql );
    }
}

// =============================================================================
// 2. INJECT CSS
// =============================================================================
add_action('wp_head', 'mrcs_inject_strict_styles', 99);
function mrcs_inject_strict_styles() {
    ?>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&family=Poppins:wght@500;700;600&display=swap');
        :root {
            --primary-blue: #0078D7; --primary-blue-dark: #005A9C; --light-blue-bg: #f0f7ff;
            --dark-text: #2c3e50; --body-text: #555; --border-color: #dee2e6;
            --white: #ffffff; --light-gray: #f8f9fa; --success-green: #28a745; --info-blue: #17a2b8;
            --danger-red: #e74c3c; --neutral-grey: #eeeeee;
        }
        
        /* HERO & LAYOUT */
        .modern-rank-layout {
            display: flex; justify-content: space-between; align-items: center; gap: 40px;
            background: #fff; padding: 30px; border-radius: 16px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.05); 
            animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            margin-bottom: 30px;
            position: relative; z-index: 10;
            overflow: visible !important; 
        }
        .hero-rank-section { flex: 2; position: relative; overflow: visible !important; z-index: 12; }
        .hero-stat { flex: 0 0 200px; text-align: center; z-index: 1; }

        .rank-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 50px; }
        .rank-header h2 { font-size: 2rem; margin: 5px 0; color: #2c3e50; font-weight: 800; font-family: 'Poppins', sans-serif; }
        .xp-badge {
            background: #e3f2fd; color: #0078D7; padding: 8px 16px; border-radius: 50px;
            font-weight: 700; font-size: 0.85rem; box-shadow: 0 4px 10px rgba(0,120,215,0.15);
        }

        /* TIMELINE */
        .timeline-container { 
            display: flex !important; justify-content: space-between; align-items: flex-start; 
            position: relative; padding: 0 10px; width: 100%; box-sizing: border-box; margin-top: 30px;
            overflow: visible !important;
        }
        .timeline-item { 
            display: flex; flex-direction: column; align-items: center; position: relative; flex: 1; z-index: 1; 
            overflow: visible !important;
        }
        .timeline-item:last-child { flex: 0; } 

        .timeline-marker { 
            position: relative; width: 100%; display: flex; justify-content: center; margin-bottom: 15px; 
            overflow: visible !important; z-index: 5;
        }
        
        .current-score-floater {
            position: absolute; 
            top: -55px; left: 50%; transform: translateX(-50%);
            background: var(--primary-blue); color: white; padding: 8px 14px; 
            border-radius: 8px; font-weight: 800; font-size: 0.95rem; white-space: nowrap;
            box-shadow: 0 5px 20px rgba(0,120,215,0.4);
            animation: bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 99999; pointer-events: none;
        }
        .current-score-floater::after {
            content: ""; position: absolute; bottom: -8px; left: 50%; margin-left: -8px;
            border-width: 8px 8px 0; border-style: solid; 
            border-color: var(--primary-blue) transparent transparent transparent;
        }

        .marker-icon {
            width: 50px; height: 50px; border-radius: 50%; background: #fff; border: 2px solid #e0e0e0;
            color: #ccc; display: flex; align-items: center; justify-content: center; font-size: 1.4rem;
            position: relative; z-index: 2; transition: all 0.4s ease;
        }
        .timeline-line-track {
            position: absolute; top: 50%; left: 50%; width: 100%; height: 6px;
            background: #f1f3f5; transform: translateY(-50%); z-index: 1; border-radius: 4px; overflow: hidden;
        }
        .timeline-line-fill {
            height: 100%; width: 0%; background: linear-gradient(90deg, #0078D7, #4fc3f7);
            transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 0 10px rgba(0,120,215,0.3);
        }
        .timeline-content { text-align: center; transition: all 0.3s; opacity: 0.6; }
        .rank-name { display: block; font-weight: 700; color: #2c3e50; font-size: 0.85rem; margin-bottom: 2px; }
        .rank-xp { font-size: 0.75rem; color: #95a5a6; }

        .timeline-item.achieved .marker-icon { background: #f0f9ff; border-color: #0078D7; color: #0078D7; }
        .timeline-item.achieved .timeline-content { opacity: 1; }
        .timeline-item.current .marker-icon {
            background: #0078D7; color: #fff; border-color: #0078D7; box-shadow: 0 0 0 6px rgba(0, 120, 215, 0.2);
            transform: scale(1.15); animation: pulse-glow 2s infinite;
        }
        .timeline-item.current .rank-name { color: #0078D7; font-size: 0.95rem; }
        .timeline-item.current .timeline-content { opacity: 1; transform: translateY(5px); }

        .donut-chart {
            position: relative; width: 150px; height: 150px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center; margin: 0 auto;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05); 
            background: var(--neutral-grey); /* Fallback */
        }
        .donut-inner {
            width: 120px; height: 120px; background: #fff; border-radius: 50%;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .big-percent { font-size: 2rem; font-weight: 800; color: #2c3e50; line-height: 1; }
        .label { font-size: 0.75rem; text-transform: uppercase; color: #999; font-weight: 600; letter-spacing: 0.5px; }
        
        .mini-ring {
            width: 50px; height: 50px; border-radius: 50%; background: #eee;
            display: flex; align-items: center; justify-content: center; position: relative;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .mini-ring::after {
            content: ""; width: 40px; height: 40px; background: white; border-radius: 50%; position: absolute;
        }
        .ring-text { position: relative; z-index: 2; font-size: 0.8rem; font-weight: 800; color: #2c3e50; }

        .topic-split-card {
            display: flex; align-items: center; justify-content: space-between;
            background: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px;
            margin-bottom: 15px; transition: all 0.2s ease; padding: 0; overflow: hidden; min-height: 100px;
        }
        .topic-split-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.05); border-color: var(--primary-blue); }
        .topic-main-info { flex: 2; padding: 20px 25px; border-right: 1px solid #f0f0f0; }
        .topic-main-info h4 { margin: 0 0 5px 0; font-size: 1.15rem; color: #2c3e50; font-weight: 700; }
        .topic-meta-counts { font-size: 0.85rem; color: #888; display: flex; gap: 15px; }
        .topic-stats-area { flex: 2; display: flex; align-items: center; justify-content: space-around; padding: 10px 20px; }
        .stat-group-linear { display: flex; flex-direction: column; width: 120px; }
        .stat-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #999; margin-bottom: 4px; font-weight: 600; }
        .topic-progress-track { width: 100%; height: 6px; background: #f0f0f0; border-radius: 10px; overflow: hidden; }
        .topic-progress-fill { height: 100%; background: var(--primary-blue); border-radius: 10px; }
        .stat-value-text { font-size: 0.85rem; font-weight: 700; color: #555; margin-top: 4px; }
        .stat-group-circle { display: flex; flex-direction: column; align-items: center; gap: 5px; }
        .topic-actions { flex: 1; display: flex; flex-direction: column; align-items: stretch; border-left: 1px solid #f0f0f0; }
        .btn-topic-start { flex: 1; background: #fff; border: none; cursor: pointer; font-size: 0.9rem; font-weight: 700; color: var(--primary-blue); display: flex; align-items: center; justify-content: center; gap: 8px; padding: 15px; transition: background 0.2s; }
        .btn-topic-start:hover { background: #f0f7ff; }
        .btn-topic-subs { padding: 10px; text-align: center; font-size: 0.75rem; color: #888; background: #fafafa; border-top: 1px solid #f0f0f0; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
        .btn-topic-subs:hover { color: #555; background: #eee; }

        @keyframes pulse-glow { 0% { box-shadow: 0 0 0 0 rgba(0, 120, 215, 0.4); } 70% { box-shadow: 0 0 0 12px rgba(0, 120, 215, 0); } 100% { box-shadow: 0 0 0 0 rgba(0, 120, 215, 0); } }
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounceIn { 0% { transform: translateX(-50%) scale(0.5); opacity: 0; } 100% { transform: translateX(-50%) scale(1); opacity: 1; } }
        .animate-pop-in { animation: popIn 0.5s ease-out backwards; animation-delay: 0.2s; }
        @keyframes popIn { 0% { transform: scale(0.9); opacity: 0; } 50% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }

        #quizWrapper { width: 100%; max-width: 1000px; margin: 40px auto; font-family: 'Open Sans', sans-serif; }
        .quiz-content-wrapper { display: flex; gap: 20px; align-items: flex-start; }
        #mainQuizContainer, #progressBox, #quizTypeSelection, #results {
            background-color: var(--white); border: 1px solid var(--border-color); border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); padding: 30px; position: relative; overflow: hidden;
        }
        #quizTypeSelection::before, #mainQuizContainer::before, #progressBox::before, #results::before {
            content: ""; display: block; position: absolute; top: 0; left: 0; right: 0; height: 6px; background-color: var(--primary-blue);
        }
        #mainQuizContainer { flex: 1; }
        #progressBox { width: 280px; flex-shrink: 0; }
        .question { font-size: 1.15rem; font-weight: 700; color: var(--dark-text); margin-bottom: 25px; line-height: 1.5; }
        .answers label { display: flex; align-items: center; padding: 15px 20px; margin-bottom: 12px; background-color: #f9f9f9; border-radius: 8px; cursor: pointer; transition: all 0.2s; border: 2px solid transparent; }
        .answers label:hover { background-color: var(--light-blue-bg); border-color: var(--primary-blue); }
        .answers input[type="radio"] { margin-right: 15px; width: 20px; height: 20px; accent-color: var(--primary-blue); }
        .quiz-controls { margin-top: 30px; display: flex; gap: 10px; }
        #next, #submit { background-color: var(--primary-blue); color: white; border: none; padding: 12px 25px; border-radius: 6px; font-weight: 600; cursor: pointer; font-family: 'Poppins', sans-serif; width: 100%; }
        #prev { background: transparent; border: 1px solid #ccc; color: #555; padding: 12px 20px; border-radius: 6px; cursor: pointer; }

        @media (max-width: 900px) {
            .modern-rank-layout { flex-direction: column; padding: 20px; }
            .hero-rank-section { width: 100%; }
            .timeline-container { flex-direction: column; align-items: flex-start; padding-left: 20px; margin-top: 20px; }
            .timeline-item { flex-direction: row; align-items: flex-start; width: 100%; margin-bottom: 0; min-height: 80px; flex: unset; }
            .timeline-marker { width: auto; justify-content: flex-start; margin-right: 20px; margin-bottom: 0; }
            .timeline-line-track { top: 50px; left: 25px; width: 4px; height: calc(100% - 10px); transform: none; }
            .timeline-line-fill { width: 100%; height: 0%; transition: height 1.5s ease; }
            .timeline-item:last-child .timeline-line-track { display: none; }
            .timeline-content { text-align: left; padding-top: 10px; }
            .timeline-item.current .timeline-content { transform: translateX(5px); }
            .current-score-floater { top: -35px; left: 25px; transform: translateX(0); }
            .current-score-floater::after { left: 15px; transform: none; }
            .quiz-content-wrapper { flex-direction: column; }
            #progressBox { width: 100%; order: -1; }
            .topic-split-card { flex-direction: column; }
            .topic-main-info, .topic-stats-area, .topic-actions { width: 100%; border: none; border-bottom: 1px solid #eee; padding: 15px; }
            .topic-actions { flex-direction: row; }
            
        }
        
        @media (max-width: 900px){
  .timeline-line-track .current-score-floater{
    opacity: 0;
    pointer-events: none;
  }
}

    </style>
    <?php
}

// =============================================================================
// 3. INJECT JS (Strict JS - Animation Logic Removed for Main Chart)
// =============================================================================
add_action('wp_footer', 'mrcs_inject_strict_js', 99);
function mrcs_inject_strict_js() {
    ?>
    <script>
    document.addEventListener('DOMContentLoaded', function () {
        
        // Only animating mini-rings in the JS-generated menu now, 
        // as the main dashboard one is handled by PHP styles directly.
        
        function runVisuals() {
            // 2. Animate Mini Rings (Menu items)
            const miniRings = document.querySelectorAll('.mini-ring[data-green]');
            miniRings.forEach(ring => {
                let rawGreen = ring.dataset.green;
                if(typeof rawGreen === 'string') rawGreen = rawGreen.replace(',', '.');
                const targetGreen = parseFloat(rawGreen) || 0;
                
                let startTime = null; const duration = 1000;
                function step(timestamp) {
                    if (!startTime) startTime = timestamp;
                    const progress = Math.min((timestamp - startTime) / duration, 1);
                    const ease = 1 - Math.pow(1 - progress, 3);
                    const currentGreen = targetGreen * ease;
                    ring.style.background = `conic-gradient(#2ecc71 0deg ${currentGreen}deg, #e74c3c ${currentGreen}deg 360deg)`;
                    if (progress < 1) requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
            });
        }

        runVisuals();
        window.mrcsRunAnimations = runVisuals; // Expose for AJAX

        if (window.innerWidth <= 900) {
            const fills = document.querySelectorAll('.timeline-line-fill');
            fills.forEach(fill => {
                const w = fill.style.width;
                if(w) { fill.style.width = '100%'; fill.style.height = w; }
            });
        }
    });
    </script>
    <?php
}

// =============================================================================
// 4. THEME SCRIPTS
// =============================================================================
function cutting_edge_theme_scripts() {
    if ( is_user_logged_in() ) { nocache_headers(); }
    wp_enqueue_style( 'cutting-edge-style', get_stylesheet_uri() );
    wp_enqueue_script( 'cutting-edge-main-js', get_template_directory_uri() . '/js/main.js', array('jquery'), time(), true );

    $user_id = is_user_logged_in() ? get_current_user_id() : 0;
    $current_user = wp_get_current_user();
    $display_name = $current_user->exists() ? $current_user->display_name : 'Guest';

    // 1. QUESTION BANK QUERY
    $question_bank = array();
    $qbank_query = new WP_Query( array('post_type' => 'question', 'posts_per_page' => -1, 'post_status' => 'publish') );
    if ( $qbank_query->have_posts() ) {
        while ( $qbank_query->have_posts() ) {
            $qbank_query->the_post();
            $topics = get_the_terms( get_the_ID(), 'topic' );
            $topic_ids = array();
            if ( $topics && ! is_wp_error( $topics ) ) { foreach ( $topics as $topic ) $topic_ids[] = $topic->term_id; }
            $question_bank[] = array( 'id' => get_the_ID(), 'topic_ids' => $topic_ids );
        } 
    } 
    wp_reset_postdata(); 

    // 2. TOPIC TREE
    $topic_tree = array();
    $terms = get_terms( array( 'taxonomy' => 'topic', 'hide_empty' => true, 'parent' => 0 ) );
    if (!is_wp_error($terms) && !empty($terms)) {
        foreach ( $terms as $parent ) {
            $children = get_terms( array( 'taxonomy' => 'topic', 'hide_empty' => true, 'parent' => $parent->term_id ) );
            $child_nodes = array();
            if (!is_wp_error($children)) {
                foreach ( $children as $child ) {
                    $grandchildren = get_terms( array( 'taxonomy' => 'topic', 'hide_empty' => true, 'parent' => $child->term_id ) );
                    $grandchild_nodes = array();
                    if (!is_wp_error($grandchildren)) { foreach($grandchildren as $grand) $grandchild_nodes[] = array( 'id' => $grand->term_id, 'name' => $grand->name ); }
                    $child_nodes[] = array( 'id' => $child->term_id, 'name' => $child->name, 'children' => $grandchild_nodes );
                }
            }
            $topic_tree[] = array( 'id' => $parent->term_id, 'name' => $parent->name, 'children' => $child_nodes );
        }
    }

    // 3. PROGRESS DATA
    global $wpdb; $table = $wpdb->prefix . 'mrcs_user_progress'; $seen = []; $wrong = [];
    if( $user_id > 0 && $wpdb->get_var("SHOW TABLES LIKE '$table'") == $table ) {
        $seen = $wpdb->get_col( $wpdb->prepare("SELECT DISTINCT question_id FROM $table WHERE user_id = %d", $user_id) );
        $wrong = $wpdb->get_col( $wpdb->prepare("SELECT question_id FROM $table t1 WHERE user_id = %d AND attempt_time = (SELECT MAX(attempt_time) FROM $table t2 WHERE t2.question_id = t1.question_id AND t2.user_id = %d) AND is_correct = 0", $user_id, $user_id));
    }

    $active_session_data = null;
    if ($user_id > 0) {
        $raw_session = get_user_meta($user_id, 'mrcs_active_quiz_session', true);
        if (!empty($raw_session)) {
            $decoded = json_decode($raw_session);
            if (json_last_error() === JSON_ERROR_NONE) { $active_session_data = $decoded; }
        }
    }

    wp_localize_script('cutting-edge-main-js', 'myQuestionBank', array( 
        'questions' => $question_bank, 'topic_tree' => $topic_tree,
        'seen_ids' => array_map('strval', $seen), 'wrong_ids' => array_map('strval', $wrong),
        'ajax_url' => admin_url('admin-ajax.php'), 'user_id' => $user_id, 
        'saved_session' => $active_session_data,
        'user_name' => $display_name
    ));
}
add_action( 'wp_enqueue_scripts', 'cutting_edge_theme_scripts', 999 );

// =============================================================================
// 5. AJAX HANDLERS
// =============================================================================
function mrcs_record_single_answer_callback() {
    $user_id = get_current_user_id(); 
    if ( $user_id == 0 ) { wp_send_json_success('Guest'); die(); }
    global $wpdb; $table=$wpdb->prefix.'mrcs_user_progress'; 
    if($wpdb->get_var("SHOW TABLES LIKE '$table'")!=$table) mrcs_create_progress_table();
    
    $q_id = intval($_POST['question_id']); 
    $ans = sanitize_text_field($_POST['user_answer']); 
    $session_id = sanitize_text_field($_POST['session_id']);
    
    $real_correct_answer = get_field('correct_answer', $q_id);
    $real_explanation = wpautop(get_field('explanation', $q_id));
    $is_correct = ($ans === $real_correct_answer) ? 1 : 0;

    $wpdb->insert($table, array('user_id'=>$user_id, 'question_id'=>$q_id, 'quiz_session_id'=>$session_id, 'is_correct'=>$is_correct, 'user_answer'=>$ans, 'attempt_time'=>current_time('mysql')), array('%d','%d','%s','%d','%s','%s'));
    wp_send_json_success(array('status' => 'Recorded', 'is_correct' => $is_correct == 1, 'correct_answer' => $real_correct_answer, 'explanation' => $real_explanation)); 
    die();
}
add_action( 'wp_ajax_mrcs_record_single_answer', 'mrcs_record_single_answer_callback' );
add_action( 'wp_ajax_nopriv_mrcs_record_single_answer', 'mrcs_record_single_answer_callback' );

function mrcs_load_quiz_questions_callback() {
    $ids_raw = isset($_POST['ids']) ? $_POST['ids'] : '';
    $ids = json_decode(stripslashes($ids_raw));
    if (!is_array($ids) || empty($ids)) { wp_send_json_error('No IDs provided'); }
    $data = array();
    foreach($ids as $id) {
        $id = intval($id);
        $data[] = array(
            'id' => $id, 'question' => wpautop( get_field('question_text', $id) ),
            'answers' => array( 'a' => get_field('option_a', $id), 'b' => get_field('option_b', $id), 'c' => get_field('option_c', $id), 'd' => get_field('option_d', $id), 'e' => get_field('option_e', $id) )
        );
    }
    wp_send_json_success($data);
}
add_action( 'wp_ajax_mrcs_load_quiz_questions', 'mrcs_load_quiz_questions_callback' );
add_action( 'wp_ajax_nopriv_mrcs_load_quiz_questions', 'mrcs_load_quiz_questions_callback' );

function mrcs_save_session_callback() {
    if ( ! is_user_logged_in() ) { wp_send_json_success('Guest'); die(); }
    $data = wp_unslash($_POST['data']); if (!empty($data)) { update_user_meta( get_current_user_id(), 'mrcs_active_quiz_session', $data ); wp_send_json_success('Saved'); } die();
}
add_action( 'wp_ajax_mrcs_save_session', 'mrcs_save_session_callback' );
add_action( 'wp_ajax_nopriv_mrcs_save_session', 'mrcs_save_session_callback' );

function mrcs_clear_session_callback() {
    if ( ! is_user_logged_in() ) { wp_send_json_success(); die(); }
    delete_user_meta( get_current_user_id(), 'mrcs_active_quiz_session' ); wp_send_json_success(); die();
}
add_action( 'wp_ajax_mrcs_clear_session', 'mrcs_clear_session_callback' );
add_action( 'wp_ajax_nopriv_mrcs_clear_session', 'mrcs_clear_session_callback' );

function mrcs_reset_all_history_callback() {
    if ( ! is_user_logged_in() ) { wp_send_json_error('Login required'); die(); }
    global $wpdb; $table=$wpdb->prefix.'mrcs_user_progress'; $user_id=get_current_user_id();
    $wpdb->delete( $table, array( 'user_id' => $user_id ) );
    delete_user_meta( $user_id, 'mrcs_active_quiz_session' ); delete_user_meta( $user_id, 'quiz_history' );
    wp_send_json_success( 'History Cleared' ); die();
}
add_action( 'wp_ajax_mrcs_reset_all_history', 'mrcs_reset_all_history_callback' );
add_action( 'wp_ajax_nopriv_mrcs_reset_all_history', 'mrcs_reset_all_history_callback' );

function save_user_quiz_progress_callback() {
    if ( ! is_user_logged_in() ) { wp_send_json_success('Guest'); die(); }
    $user_id = get_current_user_id(); $data = json_decode( wp_unslash($_POST['data']), true ); 
    $history = get_user_meta( $user_id, 'quiz_history', true ) ?: array();
    array_unshift( $history, array('date'=>current_time('mysql'), 'quiz'=>$data['quizName'], 'correct'=>$data['correct'], 'wrong'=>$data['wrong'], 'total'=>$data['total'], 'percentage'=>$data['percentage']));
    if(count($history)>50) $history=array_slice($history,0,50);
    update_user_meta( $user_id, 'quiz_history', $history ); delete_user_meta( $user_id, 'mrcs_active_quiz_session' );
    wp_send_json_success(); die(); 
}
add_action( 'wp_ajax_save_user_quiz_progress', 'save_user_quiz_progress_callback' );
add_action( 'wp_ajax_nopriv_save_user_quiz_progress', 'save_user_quiz_progress_callback' );

function mrcs_get_question_stats_callback() {
    $qid = isset($_POST['qid']) ? intval($_POST['qid']) : 0;
    if ($qid === 0) { wp_send_json_error('Invalid QID'); }
    global $wpdb; $table_name = $wpdb->prefix . 'mrcs_user_progress';
    $results = $wpdb->get_results( $wpdb->prepare("SELECT user_answer, COUNT(*) as count FROM $table_name WHERE question_id = %d GROUP BY user_answer", $qid) );
    $stats = array('a' => 0, 'b' => 0, 'c' => 0, 'd' => 0, 'e' => 0); $total_attempts = 0;
    foreach($results as $row) { $ans = strtolower(trim($row->user_answer)); if(array_key_exists($ans, $stats)) { $stats[$ans] = intval($row->count); $total_attempts += intval($row->count); } }
    $percentages = array(); if ($total_attempts > 0) { foreach($stats as $key => $count) { $percentages[$key] = round(($count / $total_attempts) * 100); } } else { $percentages = array('a'=>0,'b'=>0,'c'=>0,'d'=>0,'e'=>0); }
    wp_send_json_success(array('total' => $total_attempts, 'counts' => $stats, 'percentages' => $percentages));
}
add_action( 'wp_ajax_mrcs_get_question_stats', 'mrcs_get_question_stats_callback' );
add_action( 'wp_ajax_nopriv_mrcs_get_question_stats', 'mrcs_get_question_stats_callback' );

add_action('after_setup_theme', 'remove_admin_bar_for_students');
function remove_admin_bar_for_students() { if(!current_user_can('manage_options')) show_admin_bar(false); }

// =============================================================================
// 6. SHORTCODE
// =============================================================================
add_shortcode('mrcs_dashboard', 'mrcs_render_dashboard_shortcode');
function mrcs_render_dashboard_shortcode() {
    if ( !is_user_logged_in() ) { return '<div class="mrcs-dashboard-login-msg">Please <a href="/login">log in</a>.</div>'; }
    global $wpdb; $user_id = get_current_user_id(); $progress_table = $wpdb->prefix . 'mrcs_user_progress';
    
    // Stats Calculations
    // JOIN with wp_posts to ensure we only count PUBLISHED questions (filters out ghosts)
    $total_bank_count = $wpdb->get_var("SELECT count(ID) FROM $wpdb->posts WHERE post_type='question' AND post_status='publish'") ?: 0;
    
    $seen = $wpdb->get_col( $wpdb->prepare("
        SELECT DISTINCT p.question_id 
        FROM $progress_table p 
        JOIN $wpdb->posts q ON p.question_id = q.ID 
        WHERE p.user_id = %d 
        AND q.post_status = 'publish' 
        AND q.post_type = 'question'
    ", $user_id) );
    
    $wrong = $wpdb->get_col( $wpdb->prepare("
        SELECT t1.question_id 
        FROM $progress_table t1 
        JOIN $wpdb->posts q ON t1.question_id = q.ID 
        WHERE t1.user_id = %d 
        AND t1.attempt_time = (
            SELECT MAX(attempt_time) 
            FROM $progress_table t2 
            WHERE t2.question_id = t1.question_id 
            AND t2.user_id = %d
        ) 
        AND t1.is_correct = 0
        AND q.post_status = 'publish' 
        AND q.post_type = 'question'
    ", $user_id, $user_id));
    
    $count_total = $total_bank_count ?: 1; 
    $count_seen = count($seen); 
    $count_wrong = count($wrong); 
    $count_correct = $count_seen - $count_wrong;
    
    // XP & Ranks
    $current_xp = ($count_correct * 10) + ($count_wrong * 1);
    $ranks = [ 
        ['name' => 'Med Student',   'limit' => 0,      'icon' => '🎓'], 
        ['name' => 'Junior Doctor', 'limit' => 500,    'icon' => '🩺'], 
        ['name' => 'Core Trainee',  'limit' => 2000,   'icon' => '🩻'], 
        ['name' => 'Registrar',     'limit' => 8000,   'icon' => '📋'], 
        ['name' => 'Consultant',    'limit' => 20000,  'icon' => '👨‍⚕️'] 
    ];
    $current_rank = $ranks[0]; $next_rank = null;
    foreach($ranks as $i => $r) { if($current_xp >= $r['limit']) { $current_rank = $r; if(isset($ranks[$i+1])) { $next_rank = $ranks[$i+1]; } } }

    // --- ACCURACY MATH & GRADIENT GENERATION (PHP - SERVER SIDE) ---
    
    $deg_green = 0;
    $deg_red_end = 0; // Default to 0 for empty state
    $chart_style = "background: #eeeeee;"; // Default Grey (Empty)

    if ($count_seen > 0) {
        $deg_green = ($count_correct / $count_seen) * 360;
        $deg_red_end = 360; // If attempted > 0, the circle completes at 360
        
        // Strictly format to avoid locale errors in CSS
        $deg_green_fixed = number_format($deg_green, 2, '.', '');
        
        // FORCE the gradient via PHP. This handles the 'first load' state correctly now.
        $chart_style = "background: conic-gradient(#2ecc71 0deg, #2ecc71 {$deg_green_fixed}deg, #e74c3c {$deg_green_fixed}deg, #e74c3c 360deg);";
    }
    
    $accuracy_percent = ($count_seen > 0) ? round(($count_correct / $count_seen) * 100) : 0;

    $topic_stats = $wpdb->get_results( $wpdb->prepare("SELECT t.name as topic_name, t.term_id, COUNT(p.id) as attempts, SUM(CASE WHEN p.is_correct = 1 THEN 1 ELSE 0 END) as correct FROM $progress_table p JOIN {$wpdb->term_relationships} tr ON p.question_id = tr.object_id JOIN {$wpdb->term_taxonomy} tt ON tr.term_taxonomy_id = tt.term_taxonomy_id JOIN {$wpdb->terms} t ON tt.term_id = t.term_id WHERE p.user_id = %d AND tt.taxonomy = 'topic' GROUP BY t.term_id", $user_id) );
    $topics_processed = []; $papers = [];
    foreach ($topic_stats as $row) {
        $acc = ($row->attempts > 0) ? round(($row->correct / $row->attempts) * 100) : 0;
        $topics_processed[] = [ 'id' => $row->term_id, 'name' => $row->topic_name, 'attempts' => $row->attempts, 'accuracy' => $acc ];
        $ancestors = get_ancestors($row->term_id, 'topic'); $root_id = !empty($ancestors) ? end($ancestors) : $row->term_id; $root_term = get_term($root_id, 'topic');
        if ($root_term && !is_wp_error($root_term)) { if (!isset($papers[$root_id])) $papers[$root_id] = ['id' => $root_id, 'name' => $root_term->name, 'attempts' => 0, 'correct' => 0]; $papers[$root_id]['attempts'] += $row->attempts; $papers[$root_id]['correct'] += $row->correct; }
    }
    usort($topics_processed, function($a, $b) { return $b['accuracy'] <=> $a['accuracy']; });
    $strongest = array_slice($topics_processed, 0, 3); $weakest = array_reverse(array_slice($topics_processed, -3));

    ob_start();
    ?>
    <div class="mrcs-dashboard-wrapper">
        <div class="dash-hero modern-rank-layout">
            <div class="hero-rank-section">
                <div class="rank-header">
                    <div>
                        <small style="color:#888; text-transform:uppercase; letter-spacing:1px; font-weight:700;">Current Rank</small>
                        <h2 class="animate-pop-in" style="margin:5px 0;"><?php echo $current_rank['icon'] . ' ' . $current_rank['name']; ?></h2>
                    </div>
                    <?php if($next_rank): ?>
                        <div class="xp-badge">Next: <?php echo $next_rank['name']; ?> (<?php echo number_format($next_rank['limit'] - $current_xp); ?> XP to go)</div>
                    <?php else: ?>
                        <div class="xp-badge">Max Rank Achieved! 🏆</div>
                    <?php endif; ?>
                </div>

                <div class="timeline-container">
                    <?php 
                    $total_ranks = count($ranks);
                    foreach($ranks as $index => $r): 
                        $is_achieved = ($current_xp >= $r['limit']);
                        $is_current = ($r['name'] === $current_rank['name']);
                        
                        $line_width = '0%';
                        if ($is_achieved && isset($ranks[$index+1])) {
                             $next_limit = $ranks[$index+1]['limit'];
                             $current_limit = $r['limit'];
                             if ($current_xp >= $next_limit) { $line_width = '100%'; } 
                             elseif ($current_xp >= $current_limit) {
                                 $range = $next_limit - $current_limit;
                                 $gained = $current_xp - $current_limit;
                                 $pct = ($gained / $range) * 100;
                                 $line_width = $pct . '%';
                             }
                        }
                    ?>
                    <div class="timeline-item <?php echo $is_achieved ? 'achieved' : ''; ?> <?php echo $is_current ? 'current' : ''; ?>">
                        <div class="timeline-marker">
                            <div class="marker-icon"><?php echo $r['icon']; ?></div>
                            <?php if($is_current): ?>
                                <div class="current-score-floater"><?php echo number_format($current_xp); ?> XP</div>
                            <?php endif; ?>
                            <?php if ($index < $total_ranks - 1): ?>
                                <div class="timeline-line-track">
                                    <div class="timeline-line-fill" style="width: <?php echo $line_width; ?>"></div>
                                </div>
                            <?php endif; ?>
                        </div>
                        <div class="timeline-content">
                            <span class="rank-name"><?php echo $r['name']; ?></span>
                            <span class="rank-xp"><?php echo number_format($r['limit']); ?> XP</span>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <div class="hero-stat">
                <div class="donut-chart animate-donut" 
                     data-green="<?php echo number_format($deg_green, 2, '.', ''); ?>" 
                     data-red="<?php echo $deg_red_end; ?>" 
                     style="<?php echo $chart_style; ?>">
                    <div class="donut-inner">
                        <span class="big-percent" data-percent="<?php echo $accuracy_percent; ?>"><?php echo $accuracy_percent; ?>%</span>
                        <span class="label">Accuracy</span>
                    </div>
                </div>
            </div>
        </div>
        
        <?php if(!empty($papers)): ?>
        <h3 class="section-title">Performance by Paper</h3>
        <div class="papers-grid">
            <?php foreach($papers as $p_id => $paper): 
                $p_acc = $paper['attempts'] > 0 ? round(($paper['correct']/$paper['attempts'])*100) : 0;
                $p_color = ($p_acc >= 70) ? '#28a745' : (($p_acc < 55) ? '#dc3545' : '#ff9800');
                $name_safe = addslashes($paper['name']);
            ?>
            <div class="paper-card dashboard-link" onclick="startDashboardQuiz(<?php echo $p_id; ?>, '<?php echo $name_safe; ?>')">
                <div class="paper-head"><h4><?php echo $paper['name']; ?></h4><span class="paper-badge" style="background:<?php echo $p_color; ?>"><?php echo $p_acc; ?>%</span></div>
                <div class="paper-stats"><span><b><?php echo $paper['correct']; ?></b> Correct</span><span><b><?php echo $paper['attempts']; ?></b> Attempts</span></div>
                <div class="mini-track"><div class="mini-fill" style="width:<?php echo $p_acc; ?>%; background:<?php echo $p_color; ?>"></div></div>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>

        <div class="dash-grid-body">
            <div class="dash-panel weak-panel">
                <div class="panel-head"><h3>⚠️ Focus Areas</h3><small>Topics < 50%</small></div>
                <div class="topic-bars">
                    <?php 
                    $weak_list = array_filter($topics_processed, function($t){ return $t['accuracy'] < 50; });
                    if(empty($weak_list)) echo '<div class="empty-state">🎉 Clean sheet!</div>';
                    else { foreach(array_slice($weak_list, 0, 5) as $topic) echo '<div class="topic-bar-item"><span>'.$topic['name'].'</span><span style="color:#dc3545">'.$topic['accuracy'].'%</span></div>'; }
                    ?>
                </div>
            </div>
            <div class="dash-panel strong-panel">
                <div class="panel-head"><h3>🚀 Top Strengths</h3><small>Highest Acc</small></div>
                <div class="topic-bars">
                    <?php 
                    if(empty($topics_processed)) echo '<div class="empty-state">No data.</div>';
                    else { foreach($strongest as $topic) echo '<div class="topic-bar-item"><span>'.$topic['name'].'</span><span style="color:#28a745">'.$topic['accuracy'].'%</span></div>'; }
                    ?>
                </div>
            </div>
        </div>

        <div id="mrcs_qbank_app" style="margin-top:40px;">
            <div id="quizTypeSelection" style="display:none;"></div>
            <div class="quiz-content-wrapper">
                <div id="mainQuizContainer" style="display:none;">
                    <div class="quiz-header-nav"><h2>Knowledge Quiz</h2></div>
                    <div id="immediateFeedbackArea"></div>
                    <div id="quiz"></div>
                    <div class="quiz-controls">
                        <button id="prev" style="display:none;">Back</button>
                        <button id="next">Next Question</button>
                        <button id="submit" style="display:none;">Finish Session</button>
                    </div>
                </div>
                <div id="progressBox" style="display:none;">
                    <h3>Progress</h3>
                    <div class="progress-stats">
                        <div class="stat-item"><span id="currentQ">1</span> / <span id="totalQ">10</span></div>
                        <div class="stat-item">Acc: <span id="accuracyDisplay">0%</span></div>
                    </div>
                    <div class="progress-bar-track"><div class="progress-bar-fill" id="progressBar"></div></div>
                    <div id="visualProgressGrid"></div>
                </div>
            </div>
            <div id="results" style="display:none;"></div>
        </div>
    </div>
    <?php return ob_get_clean();
}



// =============================================================================
// FIX: Stop WordPress converting emojis into external image files (can break on Windows)
// =============================================================================
add_action('init', function () {
    // Front-end + admin emoji scripts/styles
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_styles', 'print_emoji_styles');

    // Feeds + emails
    remove_filter('the_content_feed', 'wp_staticize_emoji');
    remove_filter('comment_text_rss', 'wp_staticize_emoji');
    remove_filter('wp_mail', 'wp_staticize_emoji_for_email');

    // TinyMCE
    add_filter('tiny_mce_plugins', function ($plugins) {
        if (is_array($plugins)) {
            return array_diff($plugins, ['wpemoji']);
        }
        return [];
    });
});


/* DEPLOY TEST */

?>
