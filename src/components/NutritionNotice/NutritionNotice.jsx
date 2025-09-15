import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info } from 'lucide-react'

export function NutritionNotice() {
  return (
    <Alert className="w-full max-w-xl">
      <Info className="h-4 w-4" />
      <AlertTitle className="font-semibold">Important Notice</AlertTitle>
      <AlertDescription>
        <ul className="list-disc space-y-1 pl-5 text-left text-sm">
          <li>
            <span className="text-accent font-medium">Default Unit:</span> If you don't provide a
            unit, the system will use <code className="font-bold">g (grams)</code>.
          </li>
          <li>
            <span className="text-accent font-medium">Custom Units:</span> You can use your own
            units, such as <i className="font-bold">3 pcs</i> or{' '}
            <i className="font-bold">1 gallon milk</i>.
          </li>
          <li>
            <span className="text-accent font-medium">AI Behavior:</span> Items that cannot be
            recognized as food will be ignored and not included in the results.
          </li>
        </ul>
      </AlertDescription>
    </Alert>
  )
}
