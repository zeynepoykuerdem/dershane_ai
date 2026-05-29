// tek bir ödevin karti
import { Button } from "@/components/ui/button";

export function HomeworkCard({homework}:{homework: any}) {
    return (
        <div>
            <p>{homework.title}</p>
            <p>{homework.description}</p>
            <p>{homework.due_date}</p>
            <p>{homework.subject}</p>
            < Button variant="outline" size="sm">Tamamlandi</Button>
        </div>
    )
}