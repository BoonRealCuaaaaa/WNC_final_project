import { Button } from "@/components/ui/button";
import { List, ListContent, ListDescription, ListHeader, ListItem, ListTitle, ListTitleGroup } from "@/components/ui/list";

const TestPage = () => {
   return (
      <div className="flex gap-x-8">
         <List>
            <ListHeader>
               <ListTitleGroup>
                  <ListTitle>Danh sách người thụ hưởng</ListTitle>
                  <ListDescription>32 người</ListDescription>
               </ListTitleGroup>
               <Button>
                  Thêm người thụ hưởng
               </Button>
            </ListHeader>
            <ListContent>
               <ListItem>
                  <div>Hello</div>
               </ListItem>
            </ListContent>
         </List>
      </div>
   );
};

export default TestPage;
