import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info } from 'lucide-react'

export function NutritionNotice() {
  return (
    <Alert className="max-w-xl">
      <Info className="h-8 w-8" />
      <AlertTitle className="font-semibold">Important Notice</AlertTitle>
      <AlertDescription>
        <ul className="list-disc space-y-1 pl-5 text-left text-sm">
          <li>
            <span className="text-accent font-medium">Default Unit:</span> If you don&apos;t provide
            a unit, the system will use <code className="font-bold">g (grams)</code>.
          </li>
          <li>
            <span className="text-accent font-medium">Custom Units:</span> You can use your own
            units, such as <i className="font-bold">3 pcs</i> or{' '}
            <i className="font-bold">1 gallon</i>.
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
