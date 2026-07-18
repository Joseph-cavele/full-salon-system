"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  serviceInputSchema,
  SERVICE_CATEGORIES,
  type ServiceInputValues,
} from "@/features/services/schema"
import { useCreateService } from "@/features/services/hooks/use-create-service"
import { useUpdateService } from "@/features/services/hooks/use-update-service"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import type { Service } from "@/types"

type ServiceCategory = (typeof SERVICE_CATEGORIES)[number]

function toCategory(value?: string): ServiceCategory {
  return SERVICE_CATEGORIES.includes(value as ServiceCategory)
    ? (value as ServiceCategory)
    : "Hair"
}

export function ServiceFormDialog({
  open,
  onOpenChange,
  service,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  service?: Service
}) {
  const createService = useCreateService()
  const updateService = useUpdateService()
  const isEditing = !!service
  const isPending = createService.isPending || updateService.isPending

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ServiceInputValues>({
    resolver: zodResolver(serviceInputSchema),
    defaultValues: {
      name: service?.name ?? "",
      description: service?.description ?? "",
      price: service?.price ?? 0,
      duration: service?.duration ?? 30,
      category: toCategory(service?.category),
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        name: service?.name ?? "",
        description: service?.description ?? "",
        price: service?.price ?? 0,
        duration: service?.duration ?? 30,
        category: toCategory(service?.category),
      })
    }
  }, [open, service, reset])

  async function onSubmit(values: ServiceInputValues) {
    try {
      if (isEditing) {
        await updateService.mutateAsync({ id: service.id, ...values })
        toast.success("Service updated")
      } else {
        await createService.mutateAsync(values)
        toast.success("Service added")
      }
      onOpenChange(false)
    } catch {
      toast.error("Could not save service. Please try again.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit service" : "Add service"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="service-name">Name</FieldLabel>
              <Input id="service-name" {...register("name")} />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>
            <Field>
              <FieldLabel htmlFor="service-description">Description</FieldLabel>
              <Textarea id="service-description" {...register("description")} />
              {errors.description && <FieldError>{errors.description.message}</FieldError>}
            </Field>
            <Field>
              <FieldLabel>Category</FieldLabel>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <FieldError>{errors.category.message}</FieldError>}
            </Field>
            <Field orientation="responsive">
              <div className="flex-1">
                <FieldLabel htmlFor="service-price">Price (R)</FieldLabel>
                <Input
                  id="service-price"
                  type="number"
                  step="1"
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && <FieldError>{errors.price.message}</FieldError>}
              </div>
              <div className="flex-1">
                <FieldLabel htmlFor="service-duration">Duration (min)</FieldLabel>
                <Input
                  id="service-duration"
                  type="number"
                  step="5"
                  {...register("duration", { valueAsNumber: true })}
                />
                {errors.duration && <FieldError>{errors.duration.message}</FieldError>}
              </div>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {isEditing ? "Save changes" : "Add service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
