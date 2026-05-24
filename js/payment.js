
// const isLocal = window.location.origin === "http://localhost:3000";
// const forteScriptSrc = isLocal ? "https://sandbox.forte.net/checkout/v2/js" : "https://checkout.forte.net/v2/js";

const forteScriptSrc = "https://sandbox.forte.net/checkout/v2/js";

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
  } else if (['failure', 'error', 'expired'].includes(response.event)) {
    document.getElementById('verificationError').style.display = 'block';
    document.getElementById('spinnerContainer').style.display = 'none';
  }
}
window.oncallback = oncallback;

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('openPaymentPortal');
  const spinner = document.getElementById('spinnerContainer');
  const error = document.getElementById('verificationError');

  btn.onclick = function() {
    spinner.style.display = 'block';
    btn.style.display = 'none';

    const hideSpinnerOnBlur = () => {
      spinner.style.display = 'none';
      window.removeEventListener('blur', hideSpinnerOnBlur);
      clearTimeout(fallbackTimer);
    };

    window.addEventListener('blur', hideSpinnerOnBlur);

  };

  const params = new URLSearchParams(window.location.search);
  document.getElementById('invoiceDate').textContent = params.get('invoiceDate') || '';
  document.getElementById('serviceDescription').textContent = params.get('serviceDescription') || '';
  document.querySelectorAll('#amountDue').forEach(el => {
    el.textContent = params.get('amount') ? `$${params.get('amount')}` : '';
  });

  spinner.style.display = 'block';

  const origin = "https://payment-helper.zimchi.workers.dev";
  const endpoint = `${origin}/verify`;
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
    if (res.status !== 200) throw new Error();
    return await res.json();
  })
  .then(data => {
    btn.setAttribute('api_access_id', data.apiId);
    btn.setAttribute('total_amount', data.amount);
    btn.setAttribute('utc_time', data.utcTime);
    btn.setAttribute('order_number', data.orderNumber);
    btn.setAttribute('signature', data.forteSignature);
    btn.setAttribute('location_id', data.locationId);

    document.getElementById('viewInvoiceLink').href = data.decryptedInvoiceUrl || "";
    const linkContainer = document.getElementById('invoiceLinkContainer');
    if (linkContainer) linkContainer.style.display = 'block';

    spinner.style.display = 'none';
    btn.style.display = 'block';
  })
  .catch(() => {
    spinner.style.display = 'none';
    error.style.display = 'block';
  });
});
