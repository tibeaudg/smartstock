// GTranslate Configuration
// Deze configuratie zorgt voor automatische vertaling zonder code wijzigingen

window.gtranslateSettings = {
  default_language: 'nl',
  languages: ['nl', 'en', 'fr', 'de', 'es', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi', 'tr', 'pl', 'sv', 'da', 'no', 'fi', 'cs', 'hu', 'ro', 'bg', 'hr', 'sk', 'sl', 'et', 'lv', 'lt', 'mt', 'cy', 'ga', 'is', 'lb', 'eu', 'ca', 'gl'],
  wrapper_selector: '.gtranslate_wrapper',
  flag_style: '3d',
  flag_size: 16,
  flag_width: 18,
  flag_height: 12,
  switcher_horizontal_position: 'right',
  switcher_vertical_position: 'bottom',
  switcher_open_direction: 'bottom',
  detect_browser_language: true,
  url_structure: 'sub_directory',
  native_language_names: true,
  flag_alt_text: true,
  custom_domain: false,
  switcher_text_color: '#ffffff',
  switcher_background_color: '#4285f4',
  switcher_hover_color: '#3367d6',
  switcher_border_color: '#dadce0',
  switcher_border_radius: 4,
  switcher_font_family: 'Arial, sans-serif',
  switcher_font_size: 14,
  switcher_font_weight: 'normal',
  switcher_text_decoration: 'none',
  switcher_box_shadow: '0 2px 4px rgba(0,0,0,0.2)',
  switcher_custom_css: '',
  switcher_hide_languages: [],
  switcher_show_languages: [],
  auto_display: true,
  auto_display_delay: 1000,
  auto_display_condition: 'browser_language_not_default',
  auto_display_condition_value: 'nl',
  auto_display_condition_operator: 'not_equals',
  auto_display_condition_scope: 'page',
  auto_display_condition_page: '',
  auto_display_condition_path: '',
  auto_display_condition_query: '',
  auto_display_condition_referrer: '',
  auto_display_condition_user_agent: '',
  auto_display_condition_ip: '',
  auto_display_condition_country: '',
  auto_display_condition_region: '',
  auto_display_condition_city: '',
  auto_display_condition_latitude: '',
  auto_display_condition_longitude: '',
  auto_display_condition_timezone: '',
  auto_display_condition_screen_resolution: '',
  auto_display_condition_color_depth: '',
  auto_display_condition_pixel_ratio: '',
  auto_display_condition_java_enabled: '',
  auto_display_condition_cookie_enabled: '',
  auto_display_condition_do_not_track: '',
  auto_display_condition_language: '',
  auto_display_condition_platform: '',
  auto_display_condition_online: '',
  auto_display_condition_battery: '',
  auto_display_condition_connection: '',
  auto_display_condition_memory: '',
  auto_display_condition_hardware_concurrency: '',
  auto_display_condition_device_memory: '',
  auto_display_condition_max_touch_points: '',
  auto_display_condition_pointer_media: '',
  auto_display_condition_hover_media: '',
  auto_display_condition_any_hover_media: '',
  auto_display_condition_any_pointer_media: '',
  auto_display_condition_prefers_reduced_motion: '',
  auto_display_condition_prefers_color_scheme: '',
  auto_display_condition_prefers_contrast: '',
  auto_display_condition_prefers_reduced_data: '',
  auto_display_condition_prefers_reduced_transparency: '',
  auto_display_condition_forced_colors: '',
  auto_display_condition_inverted_colors: '',
  auto_display_condition_monochrome: '',
  auto_display_condition_orientation: '',
  auto_display_condition_resolution: '',
  auto_display_condition_scan: '',
  auto_display_condition_grid: '',
  auto_display_condition_update: '',
  auto_display_condition_overflow_block: '',
  auto_display_condition_overflow_inline: '',
  auto_display_condition_color_gamut: '',
  auto_display_condition_dynamic_range: '',
  auto_display_condition_video_color_gamut: '',
  auto_display_condition_video_dynamic_range: '',
  auto_display_condition_scripting: '',
  auto_display_condition_pointer: '',
  auto_display_condition_hover: '',
  auto_display_condition_any_pointer: '',
  auto_display_condition_any_hover: '',
  auto_display_condition_scan: '',
  auto_display_condition_grid: '',
  auto_display_condition_update: '',
  auto_display_condition_overflow_block: '',
  auto_display_condition_overflow_inline: '',
  auto_display_condition_color_gamut: '',
  auto_display_condition_dynamic_range: '',
  auto_display_condition_video_color_gamut: '',
  auto_display_condition_video_dynamic_range: '',
  auto_display_condition_scripting: '',
  auto_display_condition_pointer: '',
  auto_display_condition_hover: '',
  auto_display_condition_any_pointer: '',
  auto_display_condition_any_hover: ''
};

// Auto-detect and translate
(function() {
  'use strict';
  
  // Detect browser language
  const browserLang = navigator.language || navigator.userLanguage;
  const defaultLang = 'nl';
  
  // Only auto-translate if browser language is not Dutch
  if (browserLang && !browserLang.startsWith('nl')) {
    // Wait for page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initTranslation);
    } else {
      initTranslation();
    }
  }
  
  function initTranslation() {
    // Wait a bit for Google Translate to load
    setTimeout(function() {
      const selectElement = document.querySelector('.goog-te-combo');
      if (selectElement) {
        const targetLang = browserLang.split('-')[0];
        if (targetLang !== defaultLang) {
          selectElement.value = targetLang;
          selectElement.dispatchEvent(new Event('change'));
        }
      }
    }, 3000);
  }
})();
