"use strict";

class InputField {
    constructor({element, precision, value, isMoreThanZero}) {
        this.$element = element;
        this.$element.value = value.toFixed(precision);
        this.value = value;

        this._precision = precision;
        this._isMoreThanZero = isMoreThanZero;

        this.$element.onchange = () => {
            if (this._isMoreThanZero && Number(this.$element.value) <= 0) {
                this.$element.value = 1;
            }

            let value = Number(this.$element.value);
            this.$element.value = value.toFixed(this._precision);

            this.value = value;
        }

    }


}