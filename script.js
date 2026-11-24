let employees = JSON.parse(localStorage.getItem("data")) || [];

function salary(basic) {
  let hra = basic * 0.20;
  let da = basic * 0.10;
  let pf = basic * 0.12;
  let tax = basic * 1.30 * 0.05;
  return basic + hra + da - pf - tax;
}

function display() {
  let rows = "";
  let totalPay = 0;

  let list = employees.filter(e =>
    e.name.toLowerCase().includes(search.value.toLowerCase()) ||
    e.id.toLowerCase().includes(search.value.toLowerCase())
  );

  list.forEach(e => {
    let net = salary(e.basic);
    totalPay += net;

    rows += `<tr>
      <td>${e.id}</td>
      <td>${e.name}</td>
      <td>${e.dept}</td>
      <td>₹${e.basic}</td>
      <td>₹${Math.round(net)}</td>
      <td class="actions">
        <button onclick="slip('${e.id}')">Slip</button>
        <button onclick="removeEmp('${e.id}')">Delete</button>
      </td>
    </tr>`;
  });

  document.getElementById("table").innerHTML = rows;
  document.getElementById("total").innerText = list.length;
  document.getElementById("payout").innerText = "₹" + Math.round(totalPay);
  document.getElementById("average").innerText =
    "₹" + Math.round(totalPay / (list.length || 1));

  localStorage.setItem("data", JSON.stringify(employees));
}

document.getElementById("form").onsubmit = function(event) {
  event.preventDefault();

  let emp = {
    id: document.getElementById("id").value.trim().toUpperCase(),
    name: document.getElementById("name").value.trim(),
    dept: document.getElementById("dept").value,
    basic: Number(document.getElementById("basic").value)
  };

  if (emp.basic < 5000) {
    document.getElementById("error").innerText = "Minimum salary is ₹5000";
    return;
  }

  if (employees.some(e => e.id === emp.id)) {
    document.getElementById("error").innerText = "Employee ID already exists!";
    return;
  }

  employees.push(emp);
  document.getElementById("error").innerText = "";
  this.reset();
  display();
};

document.getElementById("search").oninput = display;

function removeEmp(id) {
  employees = employees.filter(e => e.id !== id);
  display();
}

function slip(id) {
  let e = employees.find(x => x.id === id);
  let basic = e.basic;
  let net = salary(basic);

  alert(
    "SALARY PAYSLIP\n\n" +
    "Name: " + e.name +
    "\nEmployee ID: " + e.id +
    "\nBasic Salary: ₹" + basic +
    "\nHRA (20%): ₹" + basic * 0.20 +
    "\nDA (10%): ₹" + basic * 0.10 +
    "\nPF (12%): ₹" + basic * 0.12 +
    "\nTax (5%): ₹" + basic * 1.30 * 0.05 +
    "\nNet Salary: ₹" + Math.round(net)
  );

  window.print();
}

display();
