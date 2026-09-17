export class ApiResponse {
  constructor(data = {}, message = "Success", extra = {}) {
    this.success = true;
    this.message = message;
    this.data = data;
    Object.assign(this, extra); // allows pagination, unreadCount etc.
  }
}
