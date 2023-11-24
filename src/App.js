import logo from "./logo.png";
import "./App.css";
import { Card, Form, InputNumber, Select, Button, message } from "antd";
import { CHAMPIONS, CHAMPION_IMAGES } from "./data";
import { useCallback, useState } from "react";
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
  const q = Form.useWatch("quantity", form);
  const quantity = parseInt(q, 10);
  const b = Form.useWatch("bonus", form);
  const bonus = parseInt(b, 10) || 0;

  const [champions, setChampions] = useState([]);
  const [championsQuantity, setChampionsQuantity] = useState(undefined);
  const [championsBonus, setChampionsBonus] = useState(0);

  const isMobile = useCheckMobileScreen();

  const teams = [
    champions.slice(0, championsQuantity),
    champions.slice(championsQuantity, championsQuantity * 2 + championsBonus),
  ];

  const onRandom = useCallback(
    (values) => {
      setChampions(random(quantity * 2 + bonus, values.banned || []));
      setChampionsQuantity(quantity);
      setChampionsBonus(bonus);
    },
    [bonus, quantity]
  );

  const copyChampions = (team) => {
    navigator.clipboard.writeText(teams[team].join(", "));
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
        <Card style={{ width: "90%", maxWidth: "1180px" }}>
          <Form layout="inline" onFinish={onRandom} form={form}>
            <Form.Item label="Quantity of Champions" name="quantity">
              <InputNumber placeholder="Exp: 10" min={5} max={40} />
            </Form.Item>
            <Form.Item label="Weak team bonus" name="bonus">
              <InputNumber placeholder="Exp: 2" min={0} max={20} />
            </Form.Item>
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
                quantity > 40
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
              }}
              style={{ marginLeft: 12 }}
            >
              Clear
            </Button>
          </Form>
        </Card>
        <Card style={{ width: "90%", maxWidth: "1180px", flexGrow: 1 }}>
          {championsQuantity !== undefined && (
            <div>
              {[0, 1].map((team) => (
                <div style={{ paddingTop: 20, paddingBottom: 20 }}>
                  <div>
                    <span
                      style={{
                        fontWeight: "bold",
                        fontSize: 24,
                      }}
                    >
                      Team {team + 1}{" "}
                    </span>
                    <CopyOutlined
                      style={{ fontSize: 20, cursor: "pointer" }}
                      onClick={copyChampions.bind(this, team)}
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
                    {teams[team].map((champion) => (
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
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default App;
