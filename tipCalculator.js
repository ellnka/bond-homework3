"use strict";

class TipCalculator {
    constructor({element}) {
        this.$element = element;

        this.$bill = new InputField({
            element: this.$element.querySelector('[data-component="bill"]'),
            precision: 2,
            value: 100,
            isMoreThanZero: true
        });
        this.$tips = new InputField({
            element: this.$element.querySelector('[data-component="tips"]'),
            precision: 2,
            value: 10,
            isMoreThanZero: false
        });
        this.$splitCount = new InputField({
            element: this.$element.querySelector('[data-component="splitCount"]'),
            precision: 0,
            value: 2,
            isMoreThanZero: true
        });
        this.$splitBetweenContainer = this.$element.querySelector('[data-selector="splitBetweenContainer"]');
        this.$results = this.$element.querySelector('[data-selector="results"]');

        this.$element.onclick = this.$element.onsubmit = (event) => {
            if (event.target.tagName !== "BUTTON") return;

            event.preventDefault();
            this._submitHandler();
        };

        this.$element.oncut = this.$element.onpaste = this.$element.onkeypress = (event) => {
            if (event.target.tagName !== "INPUT") return;
            this._resetResults();
        };

        this.$element.onchange = (event) => {
            if (event.target.tagName === "INPUT" && event.target.dataset.key === "splitBill") {
                this._resetResults();
                this.$splitBetweenContainer.classList.toggle("d-none");
            }
        }
    }

    _submitHandler() {
        this._resetResults();
        let tipsAmount = this._calculateTips(this.$tips.value, this.$bill.value);
        let billAmount = this.$bill.value + tipsAmount;
        this._renderResults("Total Bill", billAmount, "Tips Amount", tipsAmount);

        if (this._isBillSplitted()) {
            tipsAmount /= this.$splitCount.value;
            billAmount /= this.$splitCount.value;
            this._renderResults("Bill Per Person", billAmount, "Tips Per Person", tipsAmount);
        }
    }

    _isBillSplitted() {
        return !this.$splitBetweenContainer.classList.contains("d-none");
    }

    _resetResults() {
        this.$results.innerHTML = "";
    }

    _renderResults(labelBill, bill, labelTips, tips) {
        let $div = document.createElement('div');
        $div.className = "form-group row";
        if (this._isNumber(bill) && this._isNumber(tips)) {
            $div.innerHTML = `
                    <div class="col-sm-4 col-form-label">${labelBill} </div>
                    <div class="col-sm-6 col-form-label" data-selector="totalBill"> ${(Math.ceil((bill) * 100) / 100).toFixed(2)}$ </div>
                    <div class="col-sm-4 col-form-label">${labelTips} </div>
                    <div class="col-sm-6 col-form-label" data-selector="tipsAmount"> ${(Math.ceil((tips) * 100) / 100).toFixed(2)}$ </div>
            `;
        } else {
            $div.innerHTML = `<p>Ooops.... Please, check entered values.</p>`;
        }
        this.$results.appendChild($div);
    }

    _calculateTips(tips, bill) {
        return bill * tips / 100;
    }

    _isNumber(value) {
        return typeof value === 'number' && isFinite(value);
    }


}