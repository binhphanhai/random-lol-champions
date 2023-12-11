import logo from "./logo.png";
import "./App.css";
import { Card, Form, InputNumber, Select, Button, message, Switch } from "antd";
import { CHAMPIONS, CHAMPION_IMAGES } from "./data";
import { useCallback, useMemo, useState } from "react";
import { CopyOutlined } from "@ant-design/icons";
import useCheckMobileScreen from "./useCheckMobileScreen";

const options = CHAMPIONS.map((name) => ({ label: name, value: name }));

const random = (n, ignoredList) => {
  const rs = [];
  for (let i = 0; i < n; i++) {
    const item = CHAMPIONS[Math.floor(Math.random() * CHAMPIONS.length)];
    if (rs.includes(item) || ignoredList.includes(item)) {
      i--;
    } else {
      rs.push(item);
    }
  }
  return rs;
};

function App() {
  const [form] = Form.useForm();
  const quantity = parseInt(Form.useWatch("quantity", form), 10);
  const bonus = parseInt(Form.useWatch("bonus", form), 10) || 0;
  const isMultipleTeam = Form.useWatch("mode", form);
  const team = parseInt(Form.useWatch("team", form), 10) || 2;

  const [champions, setChampions] = useState([]);
  const [championsQuantity, setChampionsQuantity] = useState(undefined);
  const [championsBonus, setChampionsBonus] = useState(0);
  const [numberOfTeams, setNumberOfTeams] = useState(undefined);

  const isMobile = useCheckMobileScreen();

  const teams = useMemo(() => {
    const result = [];
    for (let i = 0; i < numberOfTeams; i++) {
      const cur = champions.slice(
        championsQuantity * i,
        championsQuantity * (i + 1) +
          (i === numberOfTeams - 1 ? championsBonus : 0)
      );
      result.push(cur);
    }
    return result;
  }, [champions, championsBonus, championsQuantity, numberOfTeams]);

  const onRandom = useCallback(
    (values) => {
      setChampions(random(quantity * team + bonus, values.banned || []));
      setChampionsQuantity(quantity);
      setChampionsBonus(bonus);
      setNumberOfTeams(team);
    },
    [bonus, team, quantity]
  );

  const copyChampions = (t) => {
    navigator.clipboard.writeText(teams[t].join(", "));
    message.success("Copied!");
  };

  if (isMobile)
    return (
      <div className="app">
        <nav className="app-header">
          <img src={logo} className="app-logo" alt="logo" />
          <div>Random LoL Champions</div>
        </nav>
        <div className="main" style={{ fontSize: 24 }}>
          Support on Desktop only
        </div>
      </div>
    );

  return (
    <div className="app">
      <nav className="app-header">
        <img src={logo} className="app-logo" alt="logo" />
        <div>Random LoL Champions</div>
      </nav>
      <div className="main">
        <Card style={{ width: "90%", maxWidth: "1280px" }}>
          <Form layout="inline" onFinish={onRandom} form={form}>
            <Form.Item name="mode" valuePropName="checked">
              <Switch checkedChildren="Teams" unCheckedChildren="Default" />
            </Form.Item>
            <Form.Item label="Quantity of Champions" name="quantity">
              <InputNumber placeholder="Exp: 10" min={5} max={20} />
            </Form.Item>
            {isMultipleTeam ? (
              <Form.Item
                label="Number of teams"
                name="team"
                style={{ width: 220 }}
              >
                <InputNumber placeholder="Exp: 2" min={2} max={8} />
              </Form.Item>
            ) : (
              <Form.Item
                label="Weak team bonus"
                name="bonus"
                style={{ width: 220 }}
              >
                <InputNumber placeholder="Exp: 2" min={0} max={20} />
              </Form.Item>
            )}

            <Form.Item
              label="Banned Champions"
              name="banned"
              rules={[
                {
                  validator: (_, value) =>
                    new Promise((resolve, reject) => {
                      if (value === undefined || value.length <= 20)
                        resolve(true);
                      reject(new Error("Maximum 20 banned champions"));
                    }),
                },
              ]}
            >
              <Select
                mode="multiple"
                allowClear
                style={{ width: "300px" }}
                placeholder="Banned"
                options={options}
                maxTagCount={2}
              />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={
                quantity === undefined ||
                Number.isNaN(quantity) ||
                quantity < 5 ||
                quantity > 20
              }
            >
              Random
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
                setChampionsQuantity(undefined);
                setChampions([]);
                setChampionsBonus(0);
                setNumberOfTeams(undefined);
              }}
              style={{ marginLeft: 12 }}
            >
              Clear
            </Button>
          </Form>
        </Card>
        <Card style={{ width: "90%", maxWidth: "1280px", flexGrow: 1 }}>
          {championsQuantity !== undefined && (
            <div>
              {Array.from({ length: numberOfTeams }, (_, index) => index).map(
                (t) => (
                  <div style={{ paddingTop: 20, paddingBottom: 20 }}>
                    <div>
                      <span
                        style={{
                          fontWeight: "bold",
                          fontSize: 24,
                        }}
                      >
                        Team {t + 1}{" "}
                      </span>
                      <CopyOutlined
                        style={{ fontSize: 20, cursor: "pointer" }}
                        onClick={copyChampions.bind(this, t)}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                      }}
                    >
                      {teams[t].map((champion) => (
                        <Card
                          style={{
                            width: 140,
                            height: 162,
                          }}
                          bodyStyle={{ padding: 0 }}
                        >
                          <img
                            width={138}
                            height={138}
                            src={CHAMPION_IMAGES[champion]}
                            alt={champion}
                            key={champion}
                            style={{
                              borderTopLeftRadius: 8,
                              borderTopRightRadius: 8,
                              objectFit: "cover",
                              verticalAlign: "middle",
                            }}
                          />
                          <div
                            style={{
                              textAlign: "center",
                              fontWeight: "bold",
                              color: "white",
                              backgroundColor: "#182339",
                              borderBottomLeftRadius: 8,
                              borderBottomRightRadius: 8,
                            }}
                          >
                            {champion}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default App;
