import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'action'];
  searchTerm: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private userDataService: UserDataService) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getUsersInfo();
  }

  getUsersInfo(){
    this.userDataService.getUsersData().subscribe({
      next: (res: any) => {
        this.dataSource.data = res;
        console.log("usersdata",res);
      },
      error: (err: any) => {
        console.log("erroe",err);
      }
    })
  }

  editRow(row: any): void {
    // Implement your logic for editing the row here
    console.log('Editing row:', row);
  }

  
  applySearch() {
    // Filter data based on the search term
    console.log("applySearch",this.searchTerm)
    const filteredData = this.dataSource.data.filter((user: any) =>
      Object.values(user).some((value: any) =>
        value.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
    if(!this.searchTerm.length)
      this.getUsersInfo();

    // Update the data source with the filtered data
    this.dataSource.data = filteredData;

    // Reset paginator to the first page after applying search
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  deleteSelectedData(){

  }
}
