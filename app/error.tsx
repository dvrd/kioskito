"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-auto flex-col justify-center px-6 py-24 lg:px-8">
      <p className="text-base font-semibold leading-8 text-blue-600">Oops!</p>
      <span className="mt-4 flex items-center gap-2 text-3xl font-bold tracking-tight sm:text-3xl">
        <AlertTriangle className="inline h-8 w-8 text-warning" />
        Error:
      </span>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-red-600 sm:text-3xl">
        {error.message}
      </h1>
      <div className="mt-10">
        <button
          onClick={reset}
          className="text-sm font-semibold leading-7 text-blue-600"
        >
          <span aria-hidden="true">&larr;</span> Retry
        </button>
      </div>
    </div>
  )
}
