import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

export interface TableRow {
  id: number;
  name: string;
  email: string;
  role: string;
  isEditing?: boolean; // Add this property
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<TableRow> = new MatTableDataSource<TableRow>();
  displayedColumns: string[] = ['select', 'name', 'email', 'role', 'action'];
  searchTerm: string = '';
  selection = new SelectionModel<any>(true, []);
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
        console.log("usersdata1",this.dataSource.data);
        this.dataSource.data = res.map((obj: any) => ({ ...obj, isEditing: false }));
        console.log("usersdata2",this.dataSource.data);
      },
      error: (err: any) => {
        console.log("erroe",err);
      }
    })
  }

  editRow(element: any): void {
    // Implement your logic for editing the row here
    element.isEditing = true;
    console.log('Editing row:', element);
  }

  updateRow(element: any): void {
    // Save the changes, update the data, and set isEditing back to false
    const index = this.dataSource.data.findIndex(user => user.id === element.id);
    console.log("indexx",index)
    if (index !== -1) {
      this.dataSource.data[index] = { ...element, isEditing: false };
      this.dataSource._updateChangeSubscription(); // Manually trigger data change detection
  }
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

    // Function to toggle selection for a row
    selectRow(row: any): void {
      this.selection.toggle(row);
    }
  
    // Function to select all rows
    selectAll(event: any): void {
      if (event.checked) {
        this.dataSource.data.forEach((row: any) => this.selection.select(row));
      } else {
        this.selection.clear();
      }
    }
}
