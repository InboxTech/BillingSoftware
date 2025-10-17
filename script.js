function updatePreview() {
    // Header and basic fields
    document.getElementById('prevInvoiceNo').innerText = document.getElementById('invoiceNo').value;
    document.getElementById('prevDate').innerText = new Date(document.getElementById('date').value).toLocaleDateString('en-IN');
    document.getElementById('prevConsignee').innerText = document.getElementById('consignee').value;
    document.getElementById('prevAddress').innerText = document.getElementById('address').value;
    document.getElementById('prevGstin').innerText = document.getElementById('gstin').value;
    document.getElementById('prevCstTin').innerText = document.getElementById('cstTin').value;
    document.getElementById('prevStateCode').innerText = document.getElementById('stateCode').value;
    document.getElementById('prevTinSt').innerText = document.getElementById('tinSt').value;
    document.getElementById('prevPoNo').innerText = document.getElementById('poNo').value;
    document.getElementById('prevOtherCharges').innerText = parseFloat(document.getElementById('otherCharges').value || 0).toLocaleString('en-IN');
    document.getElementById('prevTotalAmount').innerText = parseFloat(document.getElementById('totalAmount').value || 0).toLocaleString('en-IN');
    document.getElementById('prevGrandTotal').innerText = parseFloat(document.getElementById('grandTotal').value || 0).toLocaleString('en-IN');
    document.getElementById('prevAmountWords').innerText = document.getElementById('amountWords').innerText;
    document.getElementById('prevBankName').innerText = document.getElementById('bankName').value;
    document.getElementById('prevAccountNo').innerText = document.getElementById('accountNo').value;
    document.getElementById('prevBranch').innerText = document.getElementById('branch').value;
    document.getElementById('prevIfsc').innerText = document.getElementById('ifsc').value;
    document.getElementById('prevGstNo').innerText = document.getElementById('gstNo').value;
    document.getElementById('prevPanNo').innerText = document.getElementById('panNo').value;
    document.getElementById('prevHsnSac').innerText = document.getElementById('hsnSac').value;

    // Tax previews (with amounts)
    const totalAmount = parseFloat(document.getElementById('totalAmount').value) || 0;
    const cgstRate = parseFloat(document.getElementById('cgstRate').value) || 0;
    const sgstRate = parseFloat(document.getElementById('sgstRate').value) || 0;
    const igstRate = parseFloat(document.getElementById('igstRate').value) || 0;
    const cgstAmount = totalAmount * (cgstRate / 100);
    const sgstAmount = totalAmount * (sgstRate / 100);
    const igstAmount = totalAmount * (igstRate / 100);
    document.getElementById('prevCgstRate').innerText = `CGST @ ${cgstRate}%`;
    document.getElementById('prevCgst').innerText = `${cgstAmount.toFixed(2)}`;
    document.getElementById('prevSgstRate').innerText = `SGST @ ${sgstRate}%`;
    document.getElementById('prevSgst').innerText = `${sgstAmount.toFixed(2)}`;
    document.getElementById('prevIgstRate').innerText = `IGST @ ${igstRate}%`;
    document.getElementById('prevIgst').innerText = `${igstAmount.toFixed(2)}`;

    // Attach event listeners to buttons
    document.getElementById('newBillBtn').addEventListener('click', newBill);
    document.querySelector('.btn.text-white:nth-child(2)').addEventListener('click', resetForm);

    // Items table
    const prevItems = document.getElementById('prevItems');
    prevItems.innerHTML = '';
    const items = document.querySelectorAll('.item');
    let srCounter = 1;
    items.forEach((item) => {
        const srNo = item.querySelector('.srNo').value || srCounter++;
        const desc = item.querySelector('.itemDesc').value;
        const hsn = item.querySelector('.hsn').value;
        const qty = parseFloat(item.querySelector('.qty').value || 0).toLocaleString('en-IN');
        const rate = parseFloat(item.querySelector('.rate').value || 0).toFixed(2);
        const total = parseFloat(item.querySelector('.total').value || 0).toLocaleString('en-IN');
        const row = `
            <tr>
                <td>${srNo}</td>
                <td colspan="2">${desc}</td>
                <td>${hsn}</td>
                <td>${qty}</td>
                <td>${rate}</td>
                <td>${total}</td>
            </tr>
        `;
        prevItems.innerHTML += row;
    });

    // Add handwritten class to totals for style (optional)
    document.querySelectorAll('.grand-total span, .charges span').forEach(el => el.classList.add('handwritten'));
}

// Calculate totals function
function calculateTotals() {
    let subTotal = 0;
    const items = document.querySelectorAll('.item');
    items.forEach((item) => {
        const qty = parseFloat(item.querySelector('.qty').value) || 0;
        const rate = parseFloat(item.querySelector('.rate').value) || 0;
        const itemTotal = qty * rate;
        item.querySelector('.total').value = itemTotal.toFixed(2);
        subTotal += itemTotal;
    });

    const otherCharges = parseFloat(document.getElementById('otherCharges').value) || 0;
    const totalAmount = subTotal + otherCharges;
    document.getElementById('totalAmount').value = totalAmount.toFixed(2);

    const cgstRate = parseFloat(document.getElementById('cgstRate').value) || 0;
    const sgstRate = parseFloat(document.getElementById('sgstRate').value) || 0;
    const igstRate = parseFloat(document.getElementById('igstRate').value) || 0;
    const cgstAmount = totalAmount * (cgstRate / 100);
    const sgstAmount = totalAmount * (sgstRate / 100);
    const igstAmount = totalAmount * (igstRate / 100);
    const grandTotal = totalAmount + cgstAmount + sgstAmount + igstAmount;
    document.getElementById('grandTotal').value = grandTotal.toFixed(2);

    document.getElementById('amountWords').innerText = numberToWords(grandTotal) + ' Rupees Only';
    updatePreview();
}

// Add item function
function addItem() {
    const itemsDiv = document.getElementById('items');
    const itemCount = itemsDiv.children.length;
    if (itemCount >= 10) {
        alert('Maximum limit of 10 items reached. Cannot add more items.');
        return;
    }
    const newItem = document.createElement('div');
    newItem.className = 'item row';
    newItem.innerHTML = `
        <div class="">
            <label class="form-label">Sr No: ${itemCount + 1}</label>
            <input type="hidden" class="srNo form-control" value="${itemCount + 1}" oninput="updatePreview()">
        </div>
        <div class="">
            <label class="form-label">Item Description:</label>
            <input type="text" class="itemDesc form-control" value="" oninput="updatePreview()">
        </div>
        <div class="col-6">
            <label class="form-label">HSN Code:</label>
            <input type="text" class="hsn form-control" value="" oninput="updatePreview()">
        </div>
        <div class="col-6">
            <label class="form-label">Qty (Nos/Set):</label>
            <input type="number" class="qty form-control" value="" oninput="updatePreview(); calculateTotals()">
        </div>
        <div class="col-6">
            <label class="form-label">Rate (Nos/Set):</label>
            <input type="number" class="rate form-control" value="" step="0.01" oninput="updatePreview(); calculateTotals()">
        </div>
        <div class="col-6">
            <label class="form-label">Total (Rs):</label>
            <input type="number" class="total form-control" readonly>
        </div>
        <button class="mt-3 btn text-white" type="button" onclick="removeItem(this)">Remove</button>
    `;
    itemsDiv.appendChild(newItem);
    updatePreview();
}

// Remove item function
function removeItem(button) {
    button.parentElement.remove();
    const items = document.querySelectorAll('.item');
    items.forEach((item, index) => {
        item.querySelector('.srNo').value = index + 1;
    });
    calculateTotals();
}

// Save bill function
function saveBill() {
    const invoiceNo = document.getElementById('invoiceNo').value;
    if (!invoiceNo) {
        alert('Please enter an invoice number.');
        return;
    }
    const billData = {
        invoiceNo: invoiceNo,
        date: document.getElementById('date').value,
        consignee: document.getElementById('consignee').value,
        address: document.getElementById('address').value,
        gstin: document.getElementById('gstin').value,
        cstTin: document.getElementById('cstTin').value,
        tinSt: document.getElementById('tinSt').value,
        stateCode: document.getElementById('stateCode').value,
        poNo: document.getElementById('poNo').value,
        otherCharges: document.getElementById('otherCharges').value,
        totalAmount: document.getElementById('totalAmount').value,
        cgstRate: document.getElementById('cgstRate').value,
        sgstRate: document.getElementById('sgstRate').value,
        igstRate: document.getElementById('igstRate').value,
        grandTotal: document.getElementById('grandTotal').value,
        amountWords: document.getElementById('amountWords').innerText,
        bankName: document.getElementById('bankName').value,
        accountNo: document.getElementById('accountNo').value,
        branch: document.getElementById('branch').value,
        ifsc: document.getElementById('ifsc').value,
        gstNo: document.getElementById('gstNo').value,
        panNo: document.getElementById('panNo').value,
        hsnSac: document.getElementById('hsnSac').value,
        items: Array.from(document.querySelectorAll('.item')).map(item => ({
            srNo: item.querySelector('.srNo').value,
            itemDesc: item.querySelector('.itemDesc').value,
            hsn: item.querySelector('.hsn').value,
            qty: item.querySelector('.qty').value,
            rate: item.querySelector('.rate').value,
            total: item.querySelector('.total').value
        })),
        html: document.getElementById('billPreview').outerHTML
    };
    localStorage.setItem(`bill_${invoiceNo}`, JSON.stringify(billData));
}

// Search bill function
function searchBill() {
    const searchNo = document.getElementById('searchInvoiceNo').value;
    if (!searchNo) {
        alert('Enter an invoice number to search.');
        return;
    }
    const saved = localStorage.getItem(`bill_${searchNo}`);
    const resultDiv = document.getElementById('searchResult');
    if (saved) {
        const bill = JSON.parse(saved);
        resultDiv.innerHTML = `
            <div class="searchDiv">
                <h2>Saved Bill ${searchNo} (Date: ${bill.date})</h2>
                <button onclick="printBill()">Print This Bill</button>
            </div>
            <div>${bill.html}</div>            
        `;
    } else {
        resultDiv.innerHTML = `<p>No saved bill found for invoice #${searchNo}.</p>`;
    }
}

// New bill function
function newBill() {
    // Save current bill before creating a new one
    saveBill();
    // Auto-increment invoice number based on saved bills
    let maxInvoice = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('bill_')) {
            const noStr = key.substring(5);
            const no = parseInt(noStr, 10);
            if (!isNaN(no) && no > maxInvoice) {
                maxInvoice = no;
            }
        }
    }

    const nextInvoice = maxInvoice+1;
    console.log(nextInvoice);

    // Reset all form fields
    document.getElementById('billForm').reset();
    document.getElementById('date').value = new Date().toISOString().split('T')[0];
    document.getElementById('invoiceNo').value = nextInvoice.toString().padStart(3, '0');
    document.getElementById('bankName').value = 'Union Bank of India';
    document.getElementById('accountNo').value = '38110508000123';
    document.getElementById('branch').value = 'PROF. MANEKRAO ROAD, RAOPURA';
    document.getElementById('ifsc').value = 'UBIN0538116';
    document.getElementById('gstNo').value = '24AOHPP88920M1ZU';
    document.getElementById('panNo').value = 'AOHPP88920M';
    document.getElementById('hsnSac').value = 'Taxable Value';

    // Clear items
    const itemsDiv = document.getElementById('items');
    itemsDiv.innerHTML = `
        <div class="item row">
            <div class="">
                <label class="form-label">Sr No: 1</label>
                <input type="hidden" class="srNo form-control" value="" oninput="updatePreview()">
            </div>
            <div class="">
                <label class="form-label">Item Description:</label>
                <input type="text" class="itemDesc form-control" value="BRICKS" oninput="updatePreview()">
            </div>
            <div class="col-6">
                <label class="form-label">HSN Code:</label>
                <input type="text" class="hsn form-control" value="69041000" oninput="updatePreview()">
            </div>
            <div class="col-6">
                <label class="form-label">Qty (Nos/Set):</label>
                <input type="number" class="qty form-control" value="0" oninput="updatePreview(); calculateTotals()">
            </div>
            <div class="col-6">
                <label class="form-label">Rate (Nos/Set):</label>
                <input type="number" class="rate form-control" value="0" step="0.01" oninput="updatePreview(); calculateTotals()">
            </div>
            <div class="col-6">
                <label class="form-label">Total (Rs):</label>
                <input type="number" class="total form-control" readonly>
            </div>
            <button class="mt-3 btn text-white" type="button" onclick="removeItem(this)">Remove</button>
        </div>
    `;

    // Reset totals and preview
    document.getElementById('totalAmount').value = '0';
    document.getElementById('grandTotal').value = '0';
    document.getElementById('amountWords').innerText = '';
    updatePreview();
}

// Reset form function
function resetForm() {
    // Save current invoice number
    const currentInvoiceNo = document.getElementById('invoiceNo').value;

    // Reset all form fields
    document.getElementById('billForm').reset();
    document.getElementById('date').value = new Date().toISOString().split('T')[0];
    document.getElementById('invoiceNo').value = currentInvoiceNo; // Retain current invoice number
    document.getElementById('bankName').value = 'Union Bank of India';
    document.getElementById('accountNo').value = '38110508000123';
    document.getElementById('branch').value = 'PROF. MANEKRAO ROAD, RAOPURA';
    document.getElementById('ifsc').value = 'UBIN0538116';
    document.getElementById('gstNo').value = '24AOHPP88920M1ZU';
    document.getElementById('panNo').value = 'AOHPP88920M';
    document.getElementById('hsnSac').value = 'Taxable Value';

    // Clear items
    const itemsDiv = document.getElementById('items');
    itemsDiv.innerHTML = `
        <div class="item row">
            <div class="">
                <label class="form-label">Sr No: 1</label>
                <input type="hidden" class="srNo form-control" value="1" oninput="updatePreview()">
            </div>
            <div class="">
                <label class="form-label">Item Description:</label>
                <input type="text" class="itemDesc form-control" value="BRICKS" oninput="updatePreview()">
            </div>
            <div class="col-6">
                <label class="form-label">HSN Code:</label>
                <input type="text" class="hsn form-control" value="69041000" oninput="updatePreview()">
            </div>
            <div class="col-6">
                <label class="form-label">Qty (Nos/Set):</label>
                <input type="number" class="qty form-control" value="0" oninput="updatePreview(); calculateTotals()">
            </div>
            <div class="col-6">
                <label class="form-label">Rate (Nos/Set):</label>
                <input type="number" class="rate form-control" value="0" step="0.01" oninput="updatePreview(); calculateTotals()">
            </div>
            <div class="col-6">
                <label class="form-label">Total (Rs):</label>
                <input type="number" class="total form-control" readonly>
            </div>
            <button class="mt-3 btn text-white" type="button" onclick="removeItem(this)">Remove</button>
        </div>
    `;

    // Reset totals and preview
    document.getElementById('totalAmount').value = '0';
    document.getElementById('grandTotal').value = '0';
    document.getElementById('amountWords').innerText = '';
    updatePreview();
}

// Print bill function
function printBill() {
    saveBill();
    window.print();
    if (confirm('Do you want to refresh the app?')) {
        window.location.reload();
    }
}

// Number to words function (Indian English, up to crores)
function numberToWords(num) {
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (num === 0) return 'Zero';

    let numStr = num.toString();
    let words = '';

    if (numStr.length > 2 && numStr.substring(numStr.length - 2) === '00') {
        numStr = numStr.substring(0, numStr.length - 2) + '00';
    }

    if (num >= 10000000) {
        words += numberToWords(Math.floor(num / 10000000)) + ' Crore ';
        num %= 10000000;
    }
    if (num >= 100000) {
        words += numberToWords(Math.floor(num / 100000)) + ' Lakh ';
        num %= 100000;
    }
    if (num >= 1000) {
        words += numberToWords(Math.floor(num / 1000)) + ' Thousand ';
        num %= 1000;
    }
    if (num >= 100) {
        words += a[Math.floor(num / 100)] + ' Hundred ';
        num %= 100;
    }
    if (num >= 20) {
        words += b[Math.floor(num / 10)] + ' ';
        num %= 10;
    }
    if (num > 0) {
        words += a[num] + ' ';
    }

    return words.trim();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;

    // Auto-increment invoice number based on saved bills
    let maxInvoice = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('bill_')) {
            const noStr = key.substring(5);
            const no = parseInt(noStr, 10);
            if (!isNaN(no) && no > maxInvoice) {
                maxInvoice = no;
            }
        }
    }
    const nextInvoice = maxInvoice + 1;
    document.getElementById('invoiceNo').value = nextInvoice.toString().padStart(3, '0');

    calculateTotals();
});

