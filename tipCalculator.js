"use strict";

class TipCalculator {

    constructor(rootElement) {
        if (!rootElement) return;

        this._$rootElement = rootElement;
        this._$rootElement.innerHTML = this._getFormHTML();

        this._$tips = this._$rootElement.querySelector("[data-selector='tips']");
        this._$bill = this._$rootElement.querySelector("[data-selector='bill']");
        this._$results = this._$rootElement.querySelector("[data-selector='results']");
        this._$splitCount = this._$rootElement.querySelector("[data-selector='splitCount']");
        this._$splitBetweenContainer = this._$rootElement.querySelector(".splitBetweenContainer");

        this._$rootElement.onclick = this._$rootElement.onsubmit = (event) => {
            if (event.target.tagName === "BUTTON") {
                event.preventDefault();
                this._submitCalculateTips();
            }
        };

        this._$rootElement.oncut = this._$rootElement.onpaste = (event) => {
            if (event.target.tagName === "INPUT") {
                this._resetResults();
            }
        };

        this._$rootElement.onkeypress = (event) => {
            if (event.target.tagName === "INPUT") {
                this._resetResults();
            }
        };

        this._$rootElement.onchange = (event) => {
            if (event.target.tagName === "INPUT") {
                this._resetResults();
            }

            if (event.target.tagName === "INPUT" && event.target.classList.contains("float-number")) {
                let value = Number(event.target.value);
                event.target.value = value ? value.toFixed(2) : "0.00";
            }

            if (event.target.tagName === "INPUT" && event.target.classList.contains("int-number")) {
                event.target.value = parseInt(event.target.value);
            }

            if (event.target.tagName === "INPUT" && event.target.classList.contains("more-than-zero")) {
                if (Number(event.target.value) <= 0) {
                    event.target.value = 1;
                }
            }

            if (event.target.tagName === "INPUT" && event.target.classList.contains("checkbox")) {
                this._$splitBetweenContainer.classList.toggle("d-none");
                this._$splitCount.value = (this._$splitBetweenContainer.classList.contains("d-none")) ? 1 : 2;
            }
        };

    };

    _isBillSplitted() {
        return !this._$splitBetweenContainer.classList.contains("d-none");
    }

    _resetResults() {
        this._$results.innerHTML = "";
    }

    _submitCalculateTips() {
        let tips = Number(this._$tips.value);
        let bill = Number(this._$bill.value);
        let splitCount = Number(this._$splitCount.value);

        let tipsAmount = this._calculateTips(tips, bill);
        let billAmount = bill + tipsAmount;
        let $resultRow = this._addResultsRow("Total Bill", billAmount, "Tips Amount", tipsAmount);

        this._$results.innerHTML = "";
        this._$results.appendChild($resultRow);

        if (this._isBillSplitted(splitCount)) {
            $resultRow = this._addResultsRow("Bill Per Person", billAmount / splitCount, "Tips Per Person", tipsAmount / splitCount);
            this._$results.appendChild($resultRow);
        }
    }

    _calculateTips(tips, bill) {
        return bill * tips / 100;
    }

    _getFormHTML() {
        return `
        <form class="card-body ">
            <div class="form-group row">
                <label for="bill" class="col-sm-2 col-form-label">Bill </label>
                <div class="col-sm-10 input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">$</span>
                    </div>
                    <input type="number" class="float-number form-control" data-selector="bill" id="bill" value = "100.00">
                </div>
                
            </div>
            <div class="form-group row">
                <label for="tips" class="col-sm-2 col-form-label">Tips </label>
                <div class="col-sm-10 input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">%</span>
                    </div>
                    <input type="number" class="float-number form-control" data-selector="tips" id="tips" value = "10.00">
                </div>
            </div>
            <div class="form-group row">
                <div class="col-sm-2">
                    <label class="col-form-label" for="splitBill">Split Bill </label>
                 </div>
                 <div class="col-sm-1">
                    <input class="checkbox col-form-input align-bottom" type="checkbox" data-selector="splitBill" id="splitBill">     
                </div>
                <div id="splitBetweenContainer" class="splitBetweenContainer  d-none">
                    <div class="col-sm-2 float-left">
                        <label class="col-form-label" for="splitCount">Between </label>
                     </div>
                    <div class="col-sm-8 float-right">
                        <input type="number" class="int-number more-than-zero form-control" data-selector = "splitCount" id="splitCount" value = "1">     
                    </div>
                </div>
                
             </div>
            <div class="form-group row "><button type="submit" class="btn btn-primary">Calculate Tips</button></div>
            
            
            <div data-selector="results"></div>
        </form>
        `;
    }

    _addResultsRow(labelBill, bill, labelTips, tips) {
        let $div = document.createElement('div');
        $div.className = "form-group row";
        if (this._isNumber(bill) && this._isNumber(tips)) {
            $div.innerHTML = `
                <div class="col-sm-4 col-form-label">${labelBill} </div>
                <div class="col-sm-6 col-form-label" data-selector="totalBill"> ${(Math.ceil((bill) * 100) / 100).toFixed(2)}$ </div>
                <div class="col-sm-4 col-form-label">${labelTips} </div>
                <div class="col-sm-6 col-form-label" data-selector="tipsAmount"> ${(Math.ceil((tips) * 100) / 100).toFixed(2)}$  </div>
            `;
        } else {
            $div.innerHTML = `It's not possible to calculate. Please, check entered values.`;
        }
        return $div;
    }

    _isNumber(value) {
        return typeof value === 'number' && isFinite(value);
    }

}

let tipCalculator = new TipCalculator(document.querySelector("[data-selector='container']"));