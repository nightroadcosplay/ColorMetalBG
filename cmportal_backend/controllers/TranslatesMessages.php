<?php
trait TranslatesMessages
{
    protected function t($key, ...$args) {
        $lang = $this->session->get('userLocale', 'en');
        return Constants::translate($key, $lang, ...$args);
    }

    // The language product data is shown in: ro, en, or bg for anything else -
    // the same rule the frontend applies to product names.
    protected function dataLang() {
        $lang = $this->session->get('userLocale', 'en');
        return in_array($lang, ['ro', 'en'], true) ? $lang : 'bg';
    }

    // A product's name in the user's language. BG products have no RO name, so
    // when the chosen one is empty it falls back to BG, then EN, then RO.
    protected function localizedName($ro, $en, $bg) {
        $names = ['ro' => $ro, 'en' => $en, 'bg' => $bg];
        if (!empty($names[$this->dataLang()])) {
            return $names[$this->dataLang()];
        }
        foreach (['bg', 'en', 'ro'] as $lang) {
            if (!empty($names[$lang])) {
                return $names[$lang];
            }
        }
        return '';
    }
}
