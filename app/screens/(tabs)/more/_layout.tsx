// Drawer layout for More tab
import { Drawer } from "expo-router/drawer";

function MoreDrawerLayOut() {
  return (
    <Drawer>
      <Drawer.Screen name="index" options={{title:'Stats'}} />
      <Drawer.Screen name="games" options={{title:'Games'}} />
    </Drawer>
  );
}

export default MoreDrawerLayOut;