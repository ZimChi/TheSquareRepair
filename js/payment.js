const isLocal = window.location.origin === "http://localhost:3000";
const forteScriptSrc = isLocal
  ? "https://sandbox.forte.net/checkout/v2/js"
  : "https://checkout.forte.net/v2/js";

const s = document.createElement("script");
s.type = "text/javascript";
s.src = forteScriptSrc;
s.defer = true;
document.head.appendChild(s);

function oncallback(e) {
  var response = JSON.parse(e.data);

  document.getElementById('new-window-note').style.display = 'none';

  if (response.event === 'success') {
    document.getElementById('thankYouMessage').style.display = 'block';
    document.getElementById('spinnerContainer').style.display = 'none';
    return;
  }

  if (
    response.event === 'failure' ||
    response.event === 'error' ||
    response.event === 'expired'
  ) {
    document.getElementById('verificationError').style.display = 'block';
    document.getElementById('spinnerContainer').style.display = 'none';
  }
}
window.oncallback = oncallback;

document.getElementById('openPaymentPortal').onclick = function() {
  document.getElementById('spinnerContainer').style.display = 'block';
  document.getElementById('openPaymentPortal').style.display = 'none';
};

const params = new URLSearchParams(window.location.search);

document.getElementById('invoiceDate').textContent = params.get('invoiceDate') || '';
document.getElementById('serviceDescription').textContent = params.get('serviceDescription') || '';
document.querySelectorAll('#amountDue').forEach(el => {
  el.textContent = params.get('amount') ? `$${params.get('amount')}` : '';
});

document.getElementById('spinnerContainer').style.display = 'block';

const orgin = "https://payment-helper.zimchi.workers.dev";
const endpoint = `${orgin}/verify`;
const body = JSON.stringify({
  amount: params.get('amount'),
  invoiceDate: params.get('invoiceDate'),
  orderNumber: params.get('orderNumber'),
  encryptedToken: params.get('encryptedToken')
});

fetch(endpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body
})
.then(async res => {
  if (res.status !== 200) {
    document.getElementById('spinnerContainer').style.display = 'none';
    document.getElementById('verificationError').style.display = 'block';
    return;
  }

  const data = await res.json();

  const btn = document.getElementById('openPaymentPortal');
  btn.setAttribute('api_access_id', data.apiId);
  btn.setAttribute('total_amount', data.amount);
  btn.setAttribute('utc_time', data.utcTime);
  btn.setAttribute('order_number', data.orderNumber);
  btn.setAttribute('signature', data.forteSignature);
  btn.setAttribute('location_id', data.locationId);

  document.getElementById('viewInvoiceLink').href = data.decryptedInvoiceUrl || "";
  document.getElementsByClassName('invoice-link')[0].style.display = 'block';

  document.getElementById('spinnerContainer').style.display = 'none';
  btn.style.display = 'block';
})
.catch(() => {
  document.getElementById('spinnerContainer').style.display = 'none';
  document.getElementById('verificationError').style.display = 'block';
});
