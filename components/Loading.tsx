"use client"

import { useEffect, useState } from "react"
import { Field, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"


const Loading = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 40)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center w-full">
        <h1 className="text-4xl font-bold text-center">Bancre</h1>
        <Field className="w-full max-w-md">
          <FieldLabel htmlFor="progress-upload" className="flex items-center">
            <span>Loading...</span>
            <span className="ml-auto">{progress}%</span>
          </FieldLabel>
          <Progress value={progress} id="progress-upload" />
        </Field>
      </div>
    </div>
  )
}

export default Loading
