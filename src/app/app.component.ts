import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  //===================  TITLES   =============
  title = 'Employee Registration';
  title1 = 'Register Employee';

  //================ BOOLION VALUES  =================
  employeeShow: boolean = true;
  employeeHide: boolean = false;
  submitted = false;
  buttonShow: boolean = false;
  buttonHide: boolean = true;

  //====================== FORM CONTENT ARRAYS  ==============
  designation: string[] = [];
  qualification: string[] = [];
  languages: Array<any> = [];

  //=====================  FORM DECLARATION ==================
  eRegistration!: FormGroup;
  employee: any = [];
  emplList: any = [];
  rowDataList: any = [];

  //========================  FORM VALIDATION ON CONSTRUCTOR ===============
  constructor(private fb: FormBuilder) {
    this.eRegistration = this.fb.group({
      eid: new FormControl(''),
      employeeName: new FormControl('', [
        Validators.required,
        Validators.pattern(/[A-Za-z]/),
      ]),
      designation: new FormControl(''),
      salary: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[1-9]\d*(\.\d+)?$/),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern(/[A-Za-z0-9]\w{2,}@[A-Za-z0-9]{3,}\.[A-Za-z]{3}/),
      ]),
      mobile: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[6789][0-9]{9}$/),
      ]),
      gender: new FormControl('', Validators.required),
      languages: new FormArray([]),
      qualification: new FormControl(''),
    });
  }

  //============================   CUSTOME VALIDATIONS  =================================
  get employeeName() {
    return this.eRegistration.get('employeeName');
  }
  get salary() {
    return this.eRegistration.get('salary');
  }
  get email() {
    return this.eRegistration.get('email');
  }
  get mobile() {
    return this.eRegistration.get('mobile');
  }
  get gender() {
    return this.eRegistration.get('gender');
  }
  //========================  NGONIT ==================
  ngOnInit() {
    this.designation = [
      'Manager',
      'Software Developer',
      'Software Tester',
      'Admin',
    ];

    this.qualification = ['B.A.', 'B.Com.', 'B.Sc.', 'B.Tech.', 'MBA', 'MCA'];

    this.languages = [
      { name: 'Telugu', value: 'Telugu' },
      { name: 'English', value: 'English' },
      { name: 'Hindi', value: 'Hindi' },
    ];

    //getting list
    const records = localStorage.getItem('employeeList');
    if (records !== null) {
      this.emplList = JSON.parse(records);
    }
  }

  //======================  CHECKBOX LIST  ======================
  onCheckboxChange(e: any) {
    const languages: FormArray = this.eRegistration.get(
      'languages'
    ) as FormArray;

    if (e.target.checked) {
      languages.push(new FormControl(e.target.value));
    } else {
      let i = 0;
      languages.controls.forEach((item: any) => {
        languages.removeAt(i);
        return;
      });
    }
  }

  //=========================   SUBMIT BUTTON =========================

  onSubmit() {
    this.submitted = true;
    if (this.eRegistration.invalid) {
      return;
    } else {
      this.employee = Object.assign(this.employee, this.eRegistration.value);

      let myObj = {
        eid: this.employee.eid,
        employeeName: this.employee.employeeName,
        designation: this.employee.designation,
        salary: this.employee.salary,
        email: this.employee.email,
        mobile: this.employee.mobile,
        gender: this.employee.gender,
        languages: this.employee.languages,
        qualification: this.employee.qualification,
      };

      const oldRecord = localStorage.getItem('employeeList');
      if (oldRecord !== null) {
        this.emplList = JSON.parse(oldRecord);
        const employeeList = JSON.parse(oldRecord);
        employeeList.push(myObj);
        localStorage.setItem('employeeList', JSON.stringify(employeeList));
      } else {
        const userArr = [];
        userArr.push(myObj);
        localStorage.setItem('employeeList', JSON.stringify(userArr));
      }
    }
    const records = localStorage.getItem('employeeList');
    if (records !== null) {
      this.emplList = JSON.parse(records);
    }
    this.resetForm();
  }

  //======================  FORM RESET  ======================
  resetForm() {
    this.eRegistration.reset();
    this.submitted = false;
  }

  //=========================  EDIT ROW DATA ON TABLE ====================
  editRowData(rowData: any) {
    this.rowDataList = rowData;
    this.eRegistration.setValue({
      eid: rowData.eid,
      employeeName: rowData.employeeName,
      designation: rowData.designation,
      salary: rowData.salary,
      email: rowData.email,
      mobile: rowData.mobile,
      gender: rowData.gender,
      languages: rowData.languages,
      qualification: rowData.qualification,
    });
    this.buttonShow = true;
    this.buttonHide = false;

    this.employeeShow = true;
    this.employeeHide = false;
  }

  //=========================  DELETE DATA ON TABLE ==================
  deleteRowData(rowData: any) {
    const oldRecord = localStorage.getItem('employeeList');
    if (oldRecord !== null) {
      const employeeList = JSON.parse(oldRecord);

      employeeList.splice(
        employeeList.findIndex(
          (n: any) => n.employeeName == rowData.employeeName
        ),
        1
      );
      localStorage.setItem('employeeList', JSON.stringify(employeeList));
    }
    const records = localStorage.getItem('employeeList');
    if (records !== null) {
      this.emplList = JSON.parse(records);
    }
  }

  //==============================   UPDATE DATA TO TABLE =======================
  updateRowData() {
    this.submitted = true;
    if (this.eRegistration.invalid) {
      return;
    } else {
      const oldRecord = localStorage.getItem('employeeList');
      if (oldRecord !== null) {
        const employeeList = JSON.parse(oldRecord);
        employeeList.splice(
          employeeList.findIndex((n: any) => n.eid == this.rowDataList.eid),
          1
        );

        let myObj = {
          eid: this.eRegistration.value.eid,
          employeeName: this.eRegistration.value.employeeName,
          designation: this.eRegistration.value.designation,
          salary: this.eRegistration.value.salary,
          email: this.eRegistration.value.email,
          mobile: this.eRegistration.value.mobile,
          gender: this.eRegistration.value.gender,
          languages: this.eRegistration.value.languages,
          qualification: this.eRegistration.value.qualification,
        };
        employeeList.push(myObj);
        localStorage.setItem('employeeList', JSON.stringify(employeeList));
      }
      const records = localStorage.getItem('employeeList');
      if (records !== null) {
        this.emplList = JSON.parse(records);
      }
    }
    this.resetForm();
  }

  listShow() {
    this.employeeShow = false;
    this.employeeHide = true;
  }
  listHide() {
    this.employeeShow = true;
    this.employeeHide = false;
  }
}
