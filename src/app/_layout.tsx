import { Drawer } from "expo-router/drawer";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="test.db" onInit={migrateDbIfNeeded}>
      <GestureHandlerRootView>
        <Drawer>
          <Drawer.Screen name="(tabs)" options={{ title: "Main Tabs" }} />
          <Drawer.Screen
            name="profile"
            options={{
              title: "Profile",
              drawerItemStyle: { display: "none" },
            }}
          />
          <Drawer.Screen
            name="index"
            options={{
              drawerItemStyle: { display: "none" },
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
    </SQLiteProvider>
  );
}

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  console.log("migrateDbIfNeeded");
  const DATABASE_VERSION = 1;
  const result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version"
  );
  let currentDbVersion = result?.user_version ?? 0;
  console.log(currentDbVersion, "CURRENT DB VERSION");
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  if (currentDbVersion === 0) {
    await db.execAsync(`
    PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY NOT NULL, 
          value TEXT NOT NULL, 
          intValue INTEGER
        );    `);
    await db.runAsync(
      "INSERT INTO todos (value, intValue) VALUES (?, ?)",
      "hello",
      1
    );
    await db.runAsync(
      "INSERT INTO todos (value, intValue) VALUES (?, ?)",
      "world",
      2
    );
    currentDbVersion = 1;
  }
  if (currentDbVersion === 1) {
    // Add more migrations
    await db.execAsync(`ALTER TABLE todos ADD COLUMN imageUri TEXT`);
    currentDbVersion = 2;
  }
  await db.execAsync(`PRAGMA user_version = ${currentDbVersion}`);
}
