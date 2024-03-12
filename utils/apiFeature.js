class APIFeatures {
  // Constructor initializes the APIFeatures instance with query and queryString
  constructor(query, queryString) {
    this.query = query; // Database query object
    this.queryString = queryString; // Query parameters

    // Destructure query parameters from queryString and set them as instance properties
    const {
      fields,
      page = 1,
      limit = 3,
      sort,
      ...rest
    } = { ...this.queryString };
    this.fields = fields; // Fields to include/exclude in the results
    this.page = page; // Page number for pagination
    this.limit = limit; // Number of documents per page
    this.sortVal = sort; // Sorting criteria
    this.rest = rest; // Other query parameters
  }

  // Method to filter the query based on query parameters
  filter() {
    // Convert query parameters to MongoDB query operators if applicable
    this.rest = JSON.stringify(this.rest).replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`,
    );

    // Apply filtering to the database query
    this.query = this.query.find(JSON.parse(this.rest));

    return this; // Return the updated APIFeatures instance for method chaining
  }

  // Method to sort the query results
  sort() {
    // Check if sorting criteria is provided
    if (this.sortVal) {
      // Apply sorting to the database query
      this.query = this.query.sort(this.sortVal.replace(/,/g, ' '));
    } else {
      // Apply default sorting if no criteria provided
      this.query = this.query.sort({ maxGroupSize: 1 });
    }

    return this; // Return the updated APIFeatures instance for method chaining
  }

  // Method to limit the fields returned in the query results
  limitFields() {
    // Check if specific fields are requested
    if (this.fields) {
      // Apply field limiting to the database query
      this.query = this.query.select(this.fields.replace(/,/g, ' '));
    } else {
      // Exclude '__v' field by default
      this.query = this.query.select('-__v');
    }

    return this; // Return the updated APIFeatures instance for method chaining
  }

  // Method to paginate the query results
  pagination() {
    // Calculate the number of documents to skip based on pagination parameters
    const skip = (Number(this.page) - 1) * Number(this.limit);

    // Apply pagination to the database query
    this.query = this.query.skip(skip).limit(this.limit);

    return this; // Return the updated APIFeatures instance for method chaining
  }
}

module.exports = APIFeatures;
