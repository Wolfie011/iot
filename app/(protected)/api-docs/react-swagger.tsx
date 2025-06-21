"use client"

import { useState, useEffect } from "react"
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
import { Loader2 } from "lucide-react"

type Props = {
  spec: Record<string, any>
}

function ReactSwagger({ spec }: Props) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-slate-600">Loading API documentation...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="swagger-container">
        <SwaggerUI
          spec={spec}
          docExpansion="list"
          defaultModelsExpandDepth={1}
          defaultModelExpandDepth={1}
          displayOperationId={false}
          displayRequestDuration={true}
          filter={true}
          showExtensions={true}
          showCommonExtensions={true}
          tryItOutEnabled={true}
        />
      </div>

      <style jsx global>{`
        .swagger-container {
          --swagger-ui-primary: #2563eb;
          --swagger-ui-secondary: #64748b;
          --swagger-ui-success: #10b981;
          --swagger-ui-warning: #f59e0b;
          --swagger-ui-error: #ef4444;
        }

        .swagger-ui {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .swagger-ui .topbar {
          display: none;
        }

        .swagger-ui .info {
          margin: 0;
          padding: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 0;
        }

        .swagger-ui .info .title {
          color: white;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .swagger-ui .info .description {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .swagger-ui .scheme-container {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          margin: 1rem 2rem;
          padding: 1rem;
        }

        .swagger-ui .opblock {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          margin-bottom: 1rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }

        .swagger-ui .opblock:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transform: translateY(-1px);
        }

        .swagger-ui .opblock.opblock-get {
          border-left: 4px solid #10b981;
        }

        .swagger-ui .opblock.opblock-post {
          border-left: 4px solid #2563eb;
        }

        .swagger-ui .opblock.opblock-put {
          border-left: 4px solid #f59e0b;
        }

        .swagger-ui .opblock.opblock-delete {
          border-left: 4px solid #ef4444;
        }

        .swagger-ui .opblock .opblock-summary {
          padding: 1rem 1.5rem;
          background: #fafafa;
          border-bottom: 1px solid #e2e8f0;
        }

        .swagger-ui .opblock .opblock-summary-method {
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.875rem;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          margin-right: 1rem;
        }

        .swagger-ui .opblock.opblock-get .opblock-summary-method {
          background: #dcfce7;
          color: #166534;
        }

        .swagger-ui .opblock.opblock-post .opblock-summary-method {
          background: #dbeafe;
          color: #1e40af;
        }

        .swagger-ui .opblock.opblock-put .opblock-summary-method {
          background: #fef3c7;
          color: #92400e;
        }

        .swagger-ui .opblock.opblock-delete .opblock-summary-method {
          background: #fee2e2;
          color: #991b1b;
        }

        .swagger-ui .opblock .opblock-summary-path {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-weight: 600;
          color: #374151;
        }

        .swagger-ui .btn {
          border-radius: 6px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .swagger-ui .btn.execute {
          background: #2563eb;
          border-color: #2563eb;
        }

        .swagger-ui .btn.execute:hover {
          background: #1d4ed8;
          border-color: #1d4ed8;
          transform: translateY(-1px);
        }

        .swagger-ui .response-col_status {
          font-weight: 700;
        }

        .swagger-ui .response-col_description {
          color: #64748b;
        }

        .swagger-ui .parameters-col_description {
          color: #64748b;
        }

        .swagger-ui .model-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
        }

        .swagger-ui .model .model-title {
          color: #1e293b;
          font-weight: 600;
        }

        .swagger-ui .highlight-code {
          background: #1e293b;
          color: #e2e8f0;
          border-radius: 6px;
          padding: 1rem;
        }

        .swagger-ui .filter-container {
          padding: 1rem 2rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .swagger-ui .filter .operation-filter-input {
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        .swagger-ui .filter .operation-filter-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        @media (max-width: 768px) {
          .swagger-ui .info {
            padding: 1.5rem;
          }
          
          .swagger-ui .info .title {
            font-size: 1.5rem;
          }
          
          .swagger-ui .scheme-container {
            margin: 1rem;
          }
          
          .swagger-ui .filter-container {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  )
}

export default ReactSwagger
