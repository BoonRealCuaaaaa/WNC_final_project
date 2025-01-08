import { Beneficiary } from "@/types/Beneficiary";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getBeneficiariesApi } from "@/api/beneficiaries.api";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ChooseBenificiaryListItem from "./list-item";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { BookUser } from "lucide-react";

interface Props {
    onBeneficiarySelect: (beneficiary: Beneficiary) => void,
}

export default function ChooseBenificiaryList({onBeneficiarySelect}: Props) {
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
    const { toast } = useToast();

    const { mutate: mutateBeneficiaries } = useMutation({
        mutationFn: getBeneficiariesApi,
        onSuccess: (response) => {
            if (response.status === 200) {
                setBeneficiaries(response.data.map((item) => ({
                    id: item.id,
                    accountNumber: item.accountNumber,
                    name: item.name,
                    remindName: item.shortName,
                    bank: item.bankName
                }) as Beneficiary));
            }
        },
        onError: (error: AxiosError) => {
            const message = (error.response?.data as { message: string }).message;

            toast({
                variant: "destructive",
                title: "Tải danh sách người thụ hưởng thất bại",
                description: message,
            });
        },
    });

    useEffect(() => {
        mutateBeneficiaries();
    }, [])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant="outline-primary"><BookUser/></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {(beneficiaries.length > 0) ? (
                    beneficiaries.map(beneficiary => <ChooseBenificiaryListItem key={beneficiary.id} beneficiary={beneficiary} onSelect={onBeneficiarySelect}/>)
                ) : (
                    <p>Danh sách trống</p>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}