var personnelList = [];

function validateForm() {
  var perId = document.getElementById("tknv").value;
  var perName = document.getElementById("name").value;
  var perEmail = document.getElementById("email").value;
  var perPassword = document.getElementById("password").value;
  // var perDate = document.getElementById("datepicker").value;
  // var perSalary = +document.getElementById("luongCB").value;
  // var perPosition = document.getElementById("chucvu").value;
  // var perHours = +document.getElementById("gioLam").value;

  var isValid = true;

  isValid &=
    required(perId, "tbTKNV") && checkLength(perId, "tbTKNV", 4, 6);
  isValid &=
    required(perName, "tbTen") &&
    checkPerName(perName, "tbTen");
  isValid &=
    required(perEmail, "tbEmail") && checkPerEmail(perEmail, "tbEmail");
  // isValid &=
  //   required(perPassword, "tbMatKhau") && checkPerPassword(perPassword, "pastbMatKhausword", 6, 10);
  // isValid &= required(perDate, "tbNgay");
  // isValid &= required(perSalary, "tbLuongCB");
  // isValid &= required(perPosition, "tbChucVu");
  // isValid &= required(perHours, "tbGiolam");

  // nếu isValid = true, form đúng và ngược lại
  return isValid;
}

function createPersonnel() {
  // validate dữ liệu
  var isValid = validateForm();
  if (!isValid) return;

  // Lấy thông tin người nhập vào input
  var perId = document.getElementById("tknv").value;
  var perName = document.getElementById("name").value;
  var perEmail = document.getElementById("email").value;
  var perPassword = document.getElementById("password").value;
  var perDate = document.getElementById("datepicker").value;
  var perSalary = +document.getElementById("luongCB").value;
  var perPosition = document.getElementById("chucvu").value;
  var perHours = +document.getElementById("gioLam").value;

  // Kiểm tra trùng perId
  for (var i = 0; i < personnelList.length; i++) {
    if (personnelList[i].perId === perId) {
      alert("Tên tài khoản đã tồn tại");
      return;
    }
  }

  // Tạo nhân viên mới từ thông tin nhập vào form
  var personnel = new Personnel(
    perId,
    perName,
    perEmail,
    perPassword,
    perDate,
    perSalary,
    perPosition,
    perHours
  );

  // Thêm nhân viên mới vào danh sách
  personnelList.push(personnel);

  renderPersonnels();

  saveData()
}

// Hiển thị danh sách
function renderPersonnels(data) {
  if (!data) data = personnelList;

  var html = "";
  for (var i = 0; i < data.length; i++) {
    html += `<tr>
    <td>${data[i].perId}</td>
    <td>${data[i].fullName}</td>
    <td>${data[i].email}</td>
    <td>${data[i].date}</td>
    <td>${data[i].position}</td>
    <td>${data[i].totalSalary()}</td>
    <td>${data[i].level()}</td>
    <td>
        <button data-toggle="modal" data-target="#myModal"  onclick="getPersonnelDetail('${
          data[i].perId
        }')" class="btn btn-info">Sửa</button>

        <button onclick="deletePersonnel('${
          data[i].perId
        }')" class="btn btn-danger">Xoá</button>
    </td>
  </tr>`;
  }
  // document.getElementById("chucvu") = html.option;
  document.getElementById("tableDanhSach").innerHTML = html;
}


function saveData() {
  // chuyển từ một mảng object sang định dạng JSON
  var personnelListJSON = JSON.stringify(personnelList);

  localStorage.setItem("PL", personnelListJSON);
}

function getData() {
  var personnelListJSON = localStorage.getItem("PL");

  if (!personnelListJSON) return;

  var personnelListLocal = JSON.parse(personnelListJSON);
  personnelList = mapData(personnelListLocal);

  renderPersonnels();
}

function mapData(dataFromLocal) {
  var result = [];
  for (var i = 0; i < dataFromLocal.length; i++) {
    var oldPersonnel = dataFromLocal[i];
    var newPersonnel = new Personnel(
      oldPersonnel.perId,
      oldPersonnel.fullName,
      oldPersonnel.email,
      oldPersonnel.password,
      oldPersonnel.date,
      oldPersonnel.salary,
      oldPersonnel.position,
      oldPersonnel.hours
    );
    result.push(newPersonnel);
  }

  return result;
}

function deletePersonnel(perId) {
  var index = findById(perId);
  if (index === -1) {
    alert("Không tìm thấy id phù hợp.");
    return;
  }
  personnelList.splice(index, 1);
  renderPersonnels();
  saveData();
}

// input :id => output: index
function findById(id) {
  for (var i = 0; i < personnelList.length; i++) {
    if (personnelList[i].perId === id) {
      return i;
    }
  }
  return -1;
}

function searchPersonnels() {
  var result = [];
  var keyword = document.getElementById("searchName").value;

  for (var i = 0; i < personnelList.length; i++) {
    var perLevel = personnelList[i].level();
    var perLevelName = personnelList[i].level();

    if (perLevel === keyword || perLevelName.includes(keyword)) {
      result.push(personnelList[i]);
    }
  }
  renderPersonnels(result);
}


// update 1: đưa thông tin của nhân viên muốn update lên form
function getPersonnelDetail(perId) {
  var index = findById(perId);
  if (index === -1) {
    alert("Không tìm thấy id phù hợp.");
    return;
  }
  var personnel = personnelList[index];

  document.getElementById("tknv").value = personnel.perId;
  document.getElementById("name").value = personnel.fullName;
  document.getElementById("email").value = personnel.email;
  document.getElementById("password").value = personnel.password;
  document.getElementById("datepicker").value = personnel.date;
  document.getElementById("luongCB").value = personnel.salary;
  document.getElementById("chucvu").value = personnel.position;
  document.getElementById("gioLam").value = personnel.hours;

  document.getElementById("tknv").disabled = true;
}

// update 2: cho phép người dùng sửa trên form, người dùng nhấn nút lưu => cập nhật
function updatePersonnel() {
  var perId = document.getElementById("tknv").value;
  var perName = document.getElementById("name").value;
  var perEmail = document.getElementById("email").value;
  var perPassword = document.getElementById("password").value;
  var perDate = document.getElementById("datepicker").value;
  var perSalary = +document.getElementById("luongCB").value;
  var perPosition = document.getElementById("chucvu").value;
  var perHours = +document.getElementById("gioLam").value;

  var index = findById(perId);

  if (index === -1) {
    alert("Không tìm thấy id phù hợp!");
    return;
  }

  var personnel = personnelList[index];

  personnel.fullName = perName;
  personnel.email = perEmail;
  personnel.password = perPassword;
  personnel.date = perDate;
  personnel.salary = perSalary;
  personnel.position = perPosition;
  personnel.hours = perHours;

  renderPersonnels();

  saveData();

  document.getElementById("formQLNV").reset();
  document.getElementById("tknv").disabled = false;

}


window.onload = function () {
  console.log("window onload");
  getData();
};

// ------------ VALIDATE FUNCTIONS --------------------
// check required

function required(value, spanId) {
  if (value.length === 0) {
    document.getElementById(spanId).style.display = "block";
    document.getElementById(spanId).innerHTML = "*Trường này bắt buộc nhập.";
    return false;
  }

  document.getElementById(spanId).innerHTML = "";
  return true;
}

// check minlength - maxlength
function checkLength(value, spanId, min, max) {
  if (value.length < min || value.length > max) {
    document.getElementById(spanId).innerHTML = `*Độ dài phải từ ${min} tới ${max} kí tự`;
    return false;
  }

  document.getElementById(spanId).innerHTML = "";
  return true;
}

// pattern
// regular expression: biểu thức chính quy

function checkPerId(value, spanId) {
  var pattern = /^[0-9]+$/g;
  if (pattern.test(value)) {
    document.getElementById(spanId).innerHTML = "";
    return true;
  }

  document.getElementById(spanId).innerHTML = "*Chỉ chấp nhận từ A-z";
  return false;
}

function checkPerName(value, spanId) {
  var pattern = /^[A-z ]+$/;
  if (pattern.test(value)) {
    document.getElementById(spanId).innerHTML = "";
    return true;
  }

  document.getElementById(spanId).innerHTML = "*Tên nhân viên phải là chữ (ko dấu)";
  return false;
}

function checkPerEmail(value, spanId) {
  var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (pattern.test(value)) {
    document.getElementById(spanId).innerHTML = "";
    return true;
  }

  document.getElementById(spanId).innerHTML = "*Email phải đúng định dạng";
  return false;
}

function checkPerPassword(value, spanId) {
  var pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]$/;
  if (pattern.test(value)) {
    document.getElementById(spanId).innerHTML = "";
    return true;
  }

  document.getElementById(spanId).innerHTML = "*Mật khẩu phải đúng định dạng";
  return false;
}