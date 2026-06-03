'use client'
import {useRouter} from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavigationButtonProps {
    direction:'prev' 
}

export function NavigationButton({direction}: NavigationButtonProps) {
    const router= useRouter()

    const handleClick = ()=> {
        if (direction === 'prev') {
            router.back()
        } else {
            router.forward()
        }
    }

    return (
        <Button onClick={handleClick} variant="outline">
            {direction === 'prev' ? <ArrowLeft /> : <ArrowRight />}
        </Button>
    )
} 