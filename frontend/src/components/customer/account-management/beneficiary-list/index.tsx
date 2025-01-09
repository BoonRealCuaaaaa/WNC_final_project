import { Button } from "@/components/ui/button";
import {
  List,
  ListContent,
  ListDescription,
  ListHeader,
  ListTitle,
  ListTitleGroup,
} from "@/components/ui/list";
import BeneficiaryListItem from "./list-item";
// import { Beneficiary } from "@/types/Beneficiary";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AddBeneficiaryForm from "./add-beneficiary-form";
import { useQuery } from "@tanstack/react-query";
import { getBeneficiariesApi } from "@/api/beneficiaries.api";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

export default function BeneficiaryList() {
  // const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const { toast } = useToast();

  // const { mutate: mutateBeneficiaries } = useMutation({
  //     mutationFn: getBeneficiariesApi,
  //     onSuccess: (response) => {
  //         if (response.status === 200) {
  //             setBeneficiaries(response.data.map((item) => ({
  //                 id: item.id,
  //                 accountNumber: item.accountNumber,
  //                 name: item.name,
  //                 remindName: item.shortName,
  //                 bank: item.bankName
  //             }) as Beneficiary));
  //         }
  //     },
  //     onError: (error: AxiosError) => {
  //         const message = (error.response?.data as { message: string }).message;

  //           toast({
  //             variant: "destructive",
  //             title: "Tải danh sách người thụ hưởng thất bại",
  //             description: message,
  //           });
  //     },
  // });

  const {
    data: beneficiaries,
    isLoading: isLoadingBeneficiaries,
    isError: loadingBeneficiariesError,
    refetch: refetchBeneficiaries,
  } = useQuery({
    queryKey: ["beneficiaries"],
    queryFn: getBeneficiariesApi,
  });

  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const onAddBeneficiary = () => {
    setIsAddFormOpen(false);
    refetchBeneficiaries();
  };

  const onActionSuccess = () => {
    refetchBeneficiaries();
  };

  if (isLoadingBeneficiaries) {
    return <Loader />;
  }

  if (loadingBeneficiariesError) {
    toast({
      variant: "destructive",
      title: "Tải danh sách người thụ hưởng thất bại",
      description: "Đã xảy ra lỗi khi tải danh sách người thụ hưởng",
    });
  }

  return (
    <List>
      <ListHeader>
        <ListTitleGroup>
          <ListTitle>Danh sách người thụ hưởng</ListTitle>
          <ListDescription>{beneficiaries.data.length} người</ListDescription>
        </ListTitleGroup>
        <Dialog
          open={isAddFormOpen}
          onOpenChange={(state) => setIsAddFormOpen(state)}
        >
          <DialogTrigger>
            <Button>Thêm người thụ hưởng</Button>
          </DialogTrigger>
          <DialogContent>
            <AddBeneficiaryForm onSuccess={onAddBeneficiary} />
          </DialogContent>
        </Dialog>
      </ListHeader>
      <ListContent>
        {beneficiaries.data.map((beneficiary) => (
          <BeneficiaryListItem
            key={beneficiary.id}
            beneficiary={beneficiary}
            onDeleteSuccess={onActionSuccess}
            onEditSuccess={onActionSuccess}
          />
        ))}
      </ListContent>
    </List>
  );
}
