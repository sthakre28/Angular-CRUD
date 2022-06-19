import { animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { EmployeeModel } from './new.model';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {

  formValue !: FormGroup;

  // object created to post the data in strict mode
  employeeModelObj :  EmployeeModel = new EmployeeModel ();

  // property to store object array to show in dropdown or bulk
  empData : any = [];

  showUpdate : boolean = false;
  showAdd : boolean = false;

  constructor(
    private fb:FormBuilder,
    private api:ApiService
  ) { }

  ngOnInit(): void {

    this.formValue = this.fb.group({
      firstName : [''],
      lastName : [''],
      email : [''],
      mobile: [''],
      salary : ['']
    })

    this.getAll();

  }

  postEmpDetails(){
    this.employeeModelObj.firstName = this.formValue.value.firstName;
    this.employeeModelObj.lastName = this.formValue.value.lastName;
    this.employeeModelObj.email = this.formValue.value.email;
    this.employeeModelObj.mobile = this.formValue.value.mobile;
    this.employeeModelObj.salary = this.formValue.value.salary;

    this.api.postEmployee(this.employeeModelObj).subscribe(res => {
      alert("Employee Added Successfully");
      // to close a form without calling function using html id
      let ref = document.getElementById('cancel');
      ref?.click();
      this.formValue.reset();
      this.getAll();
    },
    error=>{
      alert("Something Went Wrong")
    })
  }

  getAll(){
    this.api.getEmployee().subscribe((res:any)=>{
      this.empData  = res;
    })
  }

  deleteEmp(row:any){
    this.api.deleteEmployee(row.id).subscribe((res:any)=>{
      alert("Employee ID" + row.id + "Deleted");
      this.getAll();
    })
  }

  onEdit(row:any){
    this.showAdd =  false;
    this.showUpdate = true;
    this.employeeModelObj.id = row.id,

    this.formValue.controls['firstName'].setValue(row.firstName),
    this.formValue.controls['lastName'].setValue(row.lastName),
    this.formValue.controls['email'].setValue(row.email),
    this.formValue.controls['mobile'].setValue(row.mobile),
    this.formValue.controls['salary'].setValue(row.salary)
  }

  // in update method also we need to pass the same obj as in post
  update(){
    this.employeeModelObj.firstName = this.formValue.value.firstName;
    this.employeeModelObj.lastName = this.formValue.value.lastName;
    this.employeeModelObj.email = this.formValue.value.email;
    this.employeeModelObj.mobile = this.formValue.value.mobile;
    this.employeeModelObj.salary = this.formValue.value.salary;

    this.api.updateEmployee(this.employeeModelObj, this.employeeModelObj.id).subscribe((res:any)=>{
      alert("Employee Details"+ res.firstName + "Updated");
      let ref = document.getElementById('cancel');
      ref?.click();
      this.formValue.reset();
      this.getAll();
    })
  }

  clickAdd(){
    this.formValue.reset();
    this.showAdd =  true;
    this.showUpdate = false;
  }

}
