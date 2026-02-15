import * as Yup from "yup";
import { CATEGORIES } from "../constants/api";

export const productSchema = Yup.object({
    name: Yup.string().trim().min(3, "Min 3 characters").max(60, "Max 60 characters").required("Name is required"),
    price: Yup.number().typeError("Price must be a number").min(0, "Min 0").max(9999, "Max 9999").required("Price is required"),
    image: Yup.string().trim().url("Image must be a valid URL").required("Image is required"),
    category: Yup.string().oneOf(CATEGORIES, "Invalid category").required("Category is required"),
    description: Yup.string().trim().min(20, "Min 20 characters").max(500, "Max 500 characters").required("Description is required"),
    discount: Yup.number().typeError("Discount must be a number").min(0, "Min 0").max(90, "Max 90").required("Discount is required")
});
