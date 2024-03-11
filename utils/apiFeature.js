class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;

    const {
      fields,
      page = 1,
      limit = 3,
      sort,
      ...rest
    } = { ...this.queryString };
    this.rest = rest;
    this.fields = fields;
    this.page = page;
    this.limit = limit;
    this.sortVal = sort;
  }

  filter() {
    this.rest = JSON.stringify(this.rest).replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`,
    );
    this.query = this.query.find(JSON.parse(this.rest));

    return this;
  }

  sort() {
    if (this.sortVal) {
      this.query = this.query.sort(this.sortVal.replace(/,/g, ' '));
    } else {
      this.query = this.query.sort({ maxGroupSize: 1 });
    }

    return this;
  }

  limitFields() {
    if (this.fields) {
      this.query = this.query.select(this.fields.replace(/,/g, ' '));
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  pagination() {
    const skip = (Number(this.page) - 1) * Number(this.limit);
    this.query = this.query.skip(skip).limit(this.limit);

    return this;
  }
}

module.exports = APIFeatures;
