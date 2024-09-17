import { Form, FormField } from "./ui/form";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select } from "./ui/select";
import { useState } from "react";

const SortingForm = ({ onSortChange }) => {
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (e) => {
    e.preventDefault();
    onSortChange({ sortBy, sortOrder });
  };

  return (
    <Form onSubmit={handleSort} className="flex gap-4 mb-4">
      <FormField>
        <Label htmlFor="sort-by">Sort By</Label>
        <Select
          id="sort-by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="priority">Priority</option>
          <option value="status">Status</option>
        </Select>
      </FormField>

      <FormField>
        <Label htmlFor="sort-order">Order</Label>
        <Select
          id="sort-order"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </Select>
      </FormField>

      <Button type="submit">Apply</Button>
    </Form>
  );
};

export default SortingForm;
