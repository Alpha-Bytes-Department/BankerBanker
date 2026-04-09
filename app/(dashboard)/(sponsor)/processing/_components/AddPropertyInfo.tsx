"use client";

import GMAP from "@/app/(dashboard)/_components/GMAP";
import Button from "@/components/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/Provider/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, X } from "lucide-react";

import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const propertySchema = z.object({
  property_name: z.string().min(1, "Property name is required"),
  property_address: z.string().min(1, "Address is required"),
  property_type: z.enum([
    "Multifamily",
    "Industrial",
    "Retail",
    "Office",
    "Other",
  ]),
  number_of_units: z.number().int().min(1, "At least 1 unit"),
  rentable_area: z.preprocess(String, z.string().min(1, "Required")),
  year_built: z
    .number()
    .int()
    .min(1800, "Enter a valid year")
    .max(new Date().getFullYear(), "Cannot be in the future"),
  occupancy: z.preprocess(String, z.string().min(1, "Required")),
  year_renovated: z
    .number()
    .int()
    .min(1800, "Enter a valid year")
    .max(new Date().getFullYear(), "Cannot be in the future"),
  parking_spaces: z.number().int().min(0, "Min 0"),
});

type PropertyFormData = {
  property_name: string;
  property_address: string;
  property_type: "Multifamily" | "Industrial" | "Retail" | "Office" | "Other";
  number_of_units: number;
  rentable_area: string;
  year_built: number;
  occupancy: string;
  year_renovated: number;
  parking_spaces: number;
};

type AddPropertyInfoProps = {
  id: number;
  title?: string;
  description?: string;
  setCurrentStep?: React.Dispatch<React.SetStateAction<number>>;
  setPropertyId?: React.Dispatch<React.SetStateAction<number | null>>;
};

const AddPropertyInfo = ({
  id,
  title,
  description,
  setCurrentStep,
  setPropertyId,
}: AddPropertyInfoProps) => {
  const [location, setLocation] = React.useState({ lat: 0, lng: 0 });
  const [propertyImages, setPropertyImages] = React.useState<File[]>([]);
  const [isDraggingImages, setIsDraggingImages] = React.useState(false);
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const MAX_IMAGES = 3;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema) as never,
  });

  const onSubmit = async (data: PropertyFormData) => {
    if (location.lat === 0 && location.lng === 0) {
      toast.error("Please select a location on the map before continuing.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("property_name", data.property_name);
      formData.append("property_address", data.property_address);
      formData.append("property_type", data.property_type);
      formData.append("number_of_units", String(data.number_of_units));
      formData.append("rentable_area", String(data.rentable_area));
      formData.append("year_built", String(data.year_built));
      formData.append("occupancy", String(data.occupancy));
      formData.append("year_renovated", String(data.year_renovated));
      formData.append("parking_spaces", String(data.parking_spaces));
      formData.append("latitude", location.lat.toFixed(6));
      formData.append("longitude", location.lng.toFixed(6));

      propertyImages.forEach((image) => {
        formData.append("property_image", image);
      });

      const response = await api.post("/api/properties/", formData);

      if (response.status === 200 || response.status === 201) {
        toast.success("Property info added");
        setPropertyId?.(response?.data?.data?.id);
        setCurrentStep?.((prev) => prev + 1);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: Record<string, unknown> } };
      console.log("server error details:", err?.response?.data);
      toast.error(
        (err?.response?.data?.message as string) ||
          "Something went wrong. Please try again.",
      );
    }
  };

  const addImages = (files: File[]) => {
    const onlyImages = files.filter((file) => file.type.startsWith("image/"));

    if (onlyImages.length === 0) {
      toast.error("Please upload image files only.");
      return;
    }

    setPropertyImages((prev) => {
      const merged = [...prev, ...onlyImages];
      const unique = merged.filter(
        (file, index, arr) =>
          index ===
          arr.findIndex(
            (item) =>
              item.name === file.name &&
              item.size === file.size &&
              item.lastModified === file.lastModified,
          ),
      );

      if (unique.length > MAX_IMAGES) {
        toast.error(`You can upload up to ${MAX_IMAGES} images.`);
      }

      return unique.slice(0, MAX_IMAGES);
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    addImages(Array.from(e.target.files));
    e.target.value = "";
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingImages(false);
    addImages(Array.from(e.dataTransfer.files));
  };

  const removeImage = (index: number) => {
    setPropertyImages((prev) => prev.filter((_, i) => i !== index));
  };

  const inputClass =
    "border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent py-2.5 px-3 rounded-xl text-sm transition";
  const errorClass = "text-xs text-red-500 mt-0.5";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-xl">
            Step {id + 1} : {title}
          </h1>
          <p className="text-[#4A5565]">{description}</p>
        </div>
      </div>

      {/* Map */}
      <h1 className="mt-5 mb-2 text-xl">Select your property Location</h1>
      <GMAP onLocationSelect={setLocation} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-10 border border-[#99A1AF] p-6 rounded-2xl bg-white shadow-sm"
      >
        <h1 className="text-lg font-semibold text-gray-800 mb-1">
          Property Details
        </h1>
        <p className="text-sm text-[#4A5565] mb-5">
          Fill in the information about the property below.
        </p>
        <hr className="border-[#E5E7EB] mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-5">
          {/* Property Name */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="property_name"
              className="text-sm font-medium text-gray-700"
            >
              Property Name
            </label>
            <input
              id="property_name"
              type="text"
              className={inputClass}
              placeholder="e.g. Sunset Apartments"
              {...register("property_name", {
                required: "Property name is required",
              })}
            />
            {errors.property_name && (
              <p className={errorClass}>{errors.property_name.message}</p>
            )}
          </div>

          {/* Property Address */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="property_address"
              className="text-sm font-medium text-gray-700"
            >
              Property Address
            </label>
            <input
              id="property_address"
              type="text"
              className={inputClass}
              placeholder="e.g. 123 Main St, NY"
              {...register("property_address", {
                required: "Address is required",
              })}
            />
            {errors.property_address && (
              <p className={errorClass}>{errors.property_address.message}</p>
            )}
          </div>

          {/* Property Type */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="property_type"
              className="text-sm font-medium text-gray-700"
            >
              Property Type
            </label>
            <select
              id="property_type"
              className={`${inputClass} bg-white appearance-none`}
              {...register("property_type", {
                required: "Property type is required",
              })}
            >
              <option value="Multifamily">Multifamily</option>
              <option value="Industrial">Industrial</option>
              <option value="Retail">Retail</option>
              <option value="Office">Office</option>
              <option value="Other">Other</option>
            </select>
            {errors.property_type && (
              <p className={errorClass}>{errors.property_type.message}</p>
            )}
          </div>

          {/* Number of Units */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="number_of_units"
              className="text-sm font-medium text-gray-700"
            >
              Number of Units
            </label>
            <input
              id="number_of_units"
              type="number"
              className={inputClass}
              placeholder="e.g. 24"
              {...register("number_of_units", {
                required: "Required",
                valueAsNumber: true,
                min: { value: 1, message: "Must be at least 1" },
              })}
            />
            {errors.number_of_units && (
              <p className={errorClass}>{errors.number_of_units.message}</p>
            )}
          </div>

          {/* Rentable Area */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="rentable_area"
              className="text-sm font-medium text-gray-700"
            >
              Rentable Area (RSF)
            </label>
            <input
              id="rentable_area"
              type="text"
              className={inputClass}
              placeholder="e.g. 12500 sq ft"
              {...register("rentable_area")}
            />
            {errors.rentable_area && (
              <p className={errorClass}>{errors.rentable_area.message}</p>
            )}
          </div>

          {/* Year Built */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="year_built"
              className="text-sm font-medium text-gray-700"
            >
              Year Built
            </label>
            <input
              id="year_built"
              type="number"
              className={inputClass}
              placeholder="e.g. 1998 "
              {...register("year_built", {
                required: "Required",
                valueAsNumber: true,
              })}
            />
            {errors.year_built && (
              <p className={errorClass}>{errors.year_built.message}</p>
            )}
          </div>

          {/* Occupancy Rate */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="occupancy"
              className="text-sm font-medium text-gray-700"
            >
              Occupancy Rate (%)
            </label>
            <input
              id="occupancy"
              type="text"
              className={inputClass}
              placeholder="e.g. 92"
              {...register("occupancy")}
            />
            {errors.occupancy && (
              <p className={errorClass}>{errors.occupancy.message}</p>
            )}
          </div>

          {/* Year Renovated */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="year_renovated"
              className="text-sm font-medium text-gray-700"
            >
              Year Renovated
            </label>
            <input
              id="year_renovated"
              type="number"
              className={inputClass}
              placeholder="e.g. 2015"
              {...register("year_renovated", {
                required: "Required",
                valueAsNumber: true,
              })}
            />
            {errors.year_renovated && (
              <p className={errorClass}>{errors.year_renovated.message}</p>
            )}
          </div>

          {/* Parking Spaces */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="parking_spaces"
              className="text-sm font-medium text-gray-700"
            >
              Parking Spaces
            </label>
            <input
              id="parking_spaces"
              type="number"
              className={inputClass}
              placeholder="e.g. 40 sq ft"
              {...register("parking_spaces", {
                required: "Required",
                valueAsNumber: true,
                min: { value: 0, message: "Min 0" },
              })}
            />
            {errors.parking_spaces && (
              <p className={errorClass}>{errors.parking_spaces.message}</p>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-[#E5E7EB] p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <Label className="text-sm font-semibold text-gray-800">
                Property Images
              </Label>
              <p className="text-xs text-[#4A5565] mt-1">
                Upload photos of the property (max {MAX_IMAGES} images).
              </p>
            </div>
            <span className="text-xs text-[#4A5565]">
              {propertyImages.length}/{MAX_IMAGES}
            </span>
          </div>

          <div
            onDrop={handleImageDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingImages(true);
            }}
            onDragLeave={() => setIsDraggingImages(false)}
            className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
              isDraggingImages
                ? "border-blue-500 bg-blue-50"
                : "border-[#D1D5DB]"
            }`}
          >
            <div className="flex justify-center mb-3">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <ImagePlus className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Drag and drop property images here
            </p>
            <p className="text-xs text-[#4A5565] mb-4">
              or browse from your device
            </p>

            <Input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="inline-flex items-center justify-center rounded-md border border-[#D1D5DB] bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Browse Images
            </button>
          </div>

          {propertyImages.length > 0 && (
            <div className="mt-4 space-y-2">
              {propertyImages.map((file, index) => (
                <div
                  key={`${file.name}-${file.size}-${file.lastModified}`}
                  className="flex items-center justify-between rounded-lg border border-[#E5E7EB] px-3 py-2"
                >
                  <p className="text-sm text-gray-700 truncate pr-3">
                    {file.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    aria-label={`Remove ${file.name}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-8 pt-5 border-t border-[#E5E7EB]">
          <Button
            text={isSubmitting ? "Submitting..." : "Continue"}
            type="submit"
            arrow={!isSubmitting}
            isDisabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};

export default AddPropertyInfo;
