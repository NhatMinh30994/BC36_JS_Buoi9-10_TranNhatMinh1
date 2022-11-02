function Personnel(id, name, email, password, date, salary, position, hours){
    this.perId = id;
    this.fullName = name;
    this.email = email;
    this.password = password;
    this.date = date;
    this.salary = salary;
    this.position = position;
    this.hours = hours;


    this.totalSalary = function(){
        if(this.position==="Nhân viên")
          return this.salary;
        if(this.position==="Trưởng phòng")
          return  this.salary*2;
        if(this.position==="Sếp") 
          return this.salary*3;
    }

    this.level = function(){
        if (this.hours >= 192){
            return "xuất sắc";
        }else if (this.hours >= 176){
            return "giỏi";
        }else if (this.hours >= 160){
            return "khá";
        }else{
            return "trung bình";
        }
    }
}