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
  isEditing?: boolean;
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
  isLoading: boolean = true;
  originalData: TableRow[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private userDataService: UserDataService) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getUsersInfo();
  }

  getUsersInfo(){
    this.isLoading = true;
    this.userDataService.getUsersData().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.originalData = res.map((obj: any) => ({ ...obj, isEditing: false }));
        this.dataSource.data = [...this.originalData];
      },
      error: (err: any) => {
        this.isLoading = false;
        console.log("error",err);
      }
    })
  }

  editRow(element: any): void {
    element.isEditing = true;
  }

  updateRow(element: any): void {
    const index = this.dataSource.data.findIndex(user => user.id === element.id);
    if (index !== -1) {
      this.dataSource.data[index] = { ...element, isEditing: false };
      this.dataSource._updateChangeSubscription();
    }
  }

  
  applySearch() {
    if(!this.searchTerm.length){
      this.dataSource.data = [...this.originalData];
    }else{
      const filteredData = this.dataSource.data.filter((user: any) =>
      Object.values(user).some((value: any) =>
        value.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
      );  
      this.dataSource.data = filteredData;
      if (this.paginator) {
        this.paginator.firstPage();
      }
    }   
  }

  deleteSelectedData() {
    if (this.selection.isEmpty()) {
      return;
    }
  
    // Delete selected rows from the dataSource
    this.dataSource.data = this.dataSource.data.filter((row) => !this.selection.isSelected(row));
  
    // Clear the selection after deletion
    this.selection.clear();
  
    // If all rows on the current page were deleted, go to the previous page
    if (this.paginator) {
      const totalItems = this.dataSource.data.length;
      const pageSize = this.paginator.pageSize;
      const pageIndex = this.paginator.pageIndex;
  
      if (totalItems === 0 || pageIndex > 0 && totalItems <= pageSize * pageIndex) {
        this.paginator.previousPage();
      }
    }
  }

  // Function to toggle selection for a row
  selectRow(row: any): void {
    this.selection.toggle(row);
  }
  
  // Function to select all rows
  selectAll(event: any): void {
    if (event.checked) {
      const currentPageData = this.dataSource.connect().value.slice(
        this.paginator.pageIndex * this.paginator.pageSize,
        (this.paginator.pageIndex + 1) * this.paginator.pageSize
      );
      currentPageData.forEach((row: any) => this.selection.select(row));
    } else {
      this.selection.clear();
    }
  }


  deleteRow(element: TableRow): void {
    const index = this.dataSource.data.indexOf(element);
    if (index !== -1) {
      this.dataSource.data.splice(index, 1);
      this.dataSource._updateChangeSubscription(); 
    }
  }
    
}
