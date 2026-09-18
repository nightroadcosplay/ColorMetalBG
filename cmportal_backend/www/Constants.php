<?php
    class Constants
    {
        public static function translate($key, $lang = 'en', ...$args) {
            $file = __DIR__ . "/lang/{$lang}.json";

            if (!file_exists($file)) {
                $file = __DIR__ . "/lang/en.json";
            }

            $translations = json_decode(file_get_contents($file), true);
            $text = $translations[$key] ?? $key;

            if (!empty($args)) {
                return vsprintf($text, $args);
            }

            return $text;
        }
    }
?>
