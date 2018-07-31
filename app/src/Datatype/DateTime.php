<?php

namespace WANGHORN\Datatype;


use Sm\Core\Resolvable\Resolvable;
use Sm\Core\Resolvable\StringResolvable;
use Sm\Data\Model\Resolvable\RawModelPropertyResolvable;
use Sm\Data\Type\DateTime_;
use Sm\Data\Type\Exception\CannotCastException;
use Sm\Data\Type\Undefined_;

class DateTime extends DateTime_ {
    /**
     * @param $subject
     * @return Resolvable|DateTime_|Undefined_
     */
    public static function resolveType($subject) {
        $resolved = null;

        if (!isset($subject) || ($subject instanceof Resolvable)) {
            $resolved = $subject->resolve();
            if (!isset($resolved)) {
                return new Undefined_;
            }
        }


        if ($subject instanceof \DateTime) {

            # It's goo to deal with DateTime
            $new_subject = $subject;
        } else if ($subject instanceof Resolvable && ($subject->resolve() instanceof \DateTime)) {

            # Everything that comes our way will probably be a resolvable of some sort
            $new_subject = $subject->resolve();
        } else if ($subject instanceof StringResolvable) {

            # Wasn't sure where to put this -- this is a DateTime from MySQL right now...
            $resolved = $subject->resolve();

            # Assume that a null datetime represents an undefined value
            if (!isset($resolved)) return Undefined_::resolveType($subject);

            # format from mysql -- change if necessary
            $new_subject = \DateTime::createFromFormat('Y-m-d H:i:s', $resolved);

        } else {

            # otherwise, see if we can create a datetime from it
            $new_subject = \DateTime::createFromFormat(DATE_ISO8601, $subject);
        }

        if (!$new_subject) {
            throw new CannotCastException("Cannot resolve datetime format -- use " . DATE_ISO8601 . " , not " . json_encode($subject));
        }

        # resolve the datetime
        return parent::resolveType($new_subject);
    }
}