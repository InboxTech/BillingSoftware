const { jsPDF } = require('jspdf');
const html2canvas = require('html2canvas');
 
// Update preview function
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
    document.getElementById('prevCgst').innerText = `CGST: ₹${cgstAmount.toFixed(2)} @ ${cgstRate}%`;
    document.getElementById('prevSgst').innerText = `SGST: ₹${sgstAmount.toFixed(2)} @ ${sgstRate}%`;
    document.getElementById('prevIgst').innerText = `IGST: ₹${igstAmount.toFixed(2)} @ ${igstRate}%`;
 
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
            <td>${desc}</td>
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
    const itemCount = itemsDiv.children.length + 1;
    const newItem = document.createElement('div');
    newItem.className = 'item';
    newItem.innerHTML = `
        <label>Sr No:</label><input type="number" class="srNo" value="${itemCount}" oninput="updatePreview()"><br>
        <label>Item Description:</label><input type="text" class="itemDesc" oninput="updatePreview()"><br>
        <label>HSN Code:</label><input type="text" class="hsn" oninput="updatePreview()"><br>
        <label>Qty (Nos/Set):</label><input type="number" class="qty" oninput="calculateTotals()"><br>
        <label>Rate (Nos/Set):</label><input type="number" class="rate" step="0.01" oninput="calculateTotals()"><br>
        <label>Total (Rs):</label><input type="number" class="total" readonly><br>
        <button type="button" onclick="removeItem(this)">Remove</button>
    `;
    itemsDiv.appendChild(newItem);
    updatePreview();
}
 
// Remove item function
function removeItem(button) {
    button.parentElement.remove();
    // Renumber Sr No
    const items = document.querySelectorAll('.item');
    items.forEach((item, index) => {
        item.querySelector('.srNo').value = index + 1;
    });
    calculateTotals();
}
 
// Generate PDF function (Electron-compatible)
function generatePDF() {
    const preview = document.getElementById('billPreview');
    html2canvas(preview, { scale: 2, useCORS: true }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        const invoiceNo = document.getElementById('invoiceNo').value;
        pdf.save(`Radhe_Invoice_${invoiceNo}_${new Date().toISOString().split('T')[0]}.pdf`);
    }).catch((err) => {
        console.error('PDF generation error:', err);
        alert('Error generating PDF. Check console for details.');
    });
}
 
// Print bill function (Electron-enhanced)
function printBill() {
    window.print();
}
// Save bill function (to localStorage)
function saveBill() {
    const invoiceNo = document.getElementById('invoiceNo').value;
    const billData = {
        invoiceNo: invoiceNo,
        date: document.getElementById('date').value,
        html: document.getElementById('billPreview').outerHTML,
        data: {
            consignee: document.getElementById('consignee').value,
            // ... (add other fields as needed for reload)
        }
    };
    localStorage.setItem(`bill_${invoiceNo}`, JSON.stringify(billData));
    alert(`Bill ${invoiceNo} saved successfully!`);
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
            <h3>Saved Bill ${searchNo} (Date: ${bill.date})</h3>
            <div class="bill">${bill.html}</div>
            <button onclick="printBillFromSearch('${searchNo}')">Print This Bill</button>
            <button onclick="generatePDFFromSearch('${searchNo}')">Download PDF</button>
        `;
    } else {
        resultDiv.innerHTML = `<p>No saved bill found for invoice #${searchNo}.</p>`;
    }
}
 
// Helper for printing from search
function printBillFromSearch(invoiceNo) {
    const saved = localStorage.getItem(`bill_${invoiceNo}`);
    if (saved) {
        const bill = JSON.parse(saved);
        const printWin = window.open('', '_blank');
        printWin.document.write(bill.html);
        printWin.document.close();
        printWin.print();
    }
}
 
// Helper for PDF from search
function generatePDFFromSearch(invoiceNo) {
    const saved = localStorage.getItem(`bill_${invoiceNo}`);
    if (saved) {
        const bill = JSON.parse(saved);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = bill.html;
        document.body.appendChild(tempDiv);
        html2canvas(tempDiv, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Saved_Invoice_${invoiceNo}.pdf`);
            document.body.removeChild(tempDiv);
        });
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
    calculateTotals();
});