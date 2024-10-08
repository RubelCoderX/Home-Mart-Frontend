import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { TProduct } from "@/types";

import { toast } from "sonner";
import productApi from "@/redux/features/product/productApi";
import { FiEdit } from "react-icons/fi";

interface UpdateProductProps {
  product: TProduct;
}

const UpdateProduct: React.FC<UpdateProductProps> = ({ product }) => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TProduct>({
    defaultValues: product,
  });
  const [updateProduct, { isLoading, isSuccess }] =
    productApi.useUpdateProductMutation();

  useEffect(() => {
    if (isSuccess) {
      // Close the modal
      setOpen(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (open) {
      reset(product);
    }
  }, [open, product, reset]);

  const onSubmit = (data: TProduct) => {
    data.price = parseFloat(data.price.toString());
    data.stock = parseInt(data.stock.toString());
    data.rating = parseFloat(data.rating.toString());
    updateProduct({ productId: product._id, data })
      .unwrap()
      .then(() => {
        toast.success("Product updated successfully!", {
          position: "top-center",
        });
        setOpen(false);
      })
      .catch((error) => {
        toast.error(`Failed to update product: ${error.message}`);
      });
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <FiEdit className="text-3xl cursor-pointer "></FiEdit>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Make changes to your product here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                {...register("name", { required: "Name is required" })}
                className="col-span-3"
              />
              {errors.name && (
                <span className="text-red-500">{errors.name.message}</span>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { required: "Price is required" })}
                className="col-span-3"
              />
              {errors.price && (
                <span className="text-red-500">{errors.price.message}</span>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input
                id="category"
                {...register("category")}
                className="col-span-3"
              />
              {/* Validation for category can be added if needed */}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                {...register("description")}
                className="col-span-3"
              />
              {/* Validation for description can be added if needed */}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">
                Stock
              </Label>
              <Input
                id="stock"
                type="number"
                {...register("stock", { required: "Stock is required" })}
                className="col-span-3"
              />
              {errors.stock && (
                <span className="text-red-500">{errors.stock.message}</span>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rating" className="text-right">
                Rating
              </Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                {...register("rating", {
                  required: "Rating is required",
                  min: { value: 0, message: "Rating must be at least 0" },
                  max: { value: 5, message: "Rating must be at most 5" },
                })}
                className="col-span-3"
              />
              {errors.rating && (
                <span className="text-red-500">{errors.rating.message}</span>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">
                Image URL
              </Label>
              <Input
                id="imageUrl"
                {...register("images")}
                className="col-span-3"
              />
              {/* Validation for image URL can be added if needed */}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateProduct;
