<?php

namespace WANGHORN\Datatype;


use Sm\Data\Type\String_;

class Slug extends String_ {
	public static function resolveType($subject) {
		return parent::resolveType($subject);
	}
	public function resolve() {
		$item = parent::resolve();
		return static::slugify($item);
	}

	static public function slugify($text) {
		// replace non letter or digits by -
		$text = preg_replace('~[^\pL\d]+~u', '-', $text);

		// transliterate
		$text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);

		// remove unwanted characters
		$text = preg_replace('~[^-\w]+~', '', $text);

		// trim
		$text = trim($text, '-');

		// remove duplicate -
		$text = preg_replace('~-+~', '-', $text);

		// lowercase
		$text = strtolower($text);

		if (empty($text)) {
			return 'n-a';
		}

		return $text;
	}

}