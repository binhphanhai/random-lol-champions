import logo from "./logo.png";
import classesImage from "./classes.png";
import "./App.css";
import { Card, Form, InputNumber, Select, Button, message, Switch } from "antd";
import { CHAMPIONS, CHAMPION_IMAGES, CHAMPION_ROLE_MAP } from "./data";
import { useCallback, useMemo, useState } from "react";
import { CopyOutlined } from "@ant-design/icons";
import useCheckMobileScreen from "./useCheckMobileScreen";
import { random, halfRandom } from "./utils";

const options = CHAMPIONS.map((name) => ({ label: name, value: name }));

const positionMap = [
  "0 100%",
  "0 0",
  "100% 0",
  "100% 100%",
  "50% 100%",
  "50% 0",
];

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
      const { banned = [], optimized } = values;
      setChampions(
        optimized
          ? halfRandom(quantity, banned, bonus)
          : random(quantity * team + bonus, banned)
      );
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
        <Card style={{ width: "90%", maxWidth: 1280 }}>
          <Form layout="inline" onFinish={onRandom} form={form}>
            <Form.Item name="mode" valuePropName="checked">
              <Switch checkedChildren="Teams" unCheckedChildren="Default" />
            </Form.Item>
            <Form.Item label="Quantity of Champions" name="quantity">
              <InputNumber placeholder="Exp: 10" min={6} max={20} />
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
              <>
                <Form.Item
                  label="Weak team bonus"
                  name="bonus"
                  style={{ width: 220 }}
                >
                  <InputNumber placeholder="Exp: 2" min={0} max={20} />
                </Form.Item>
                <Form.Item name="optimized" valuePropName="checked">
                  <Switch
                    checkedChildren="Half Random"
                    unCheckedChildren="Full Random"
                  />
                </Form.Item>
              </>
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
                style={{ width: isMultipleTeam ? 302 : 180 }}
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
                quantity < 6 ||
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
        <Card style={{ width: "90%", maxWidth: 1280, flexGrow: 1 }}>
          {championsQuantity !== undefined && (
            <div>
              {Array.from({ length: numberOfTeams }, (_, index) => index).map(
                (t) => (
                  <div
                    style={{ paddingTop: 20, paddingBottom: 20 }}
                    key={`team-${t}`}
                  >
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
                          bodyStyle={{
                            padding: 0,
                            display: "flex",
                            flexDirection: "column",
                          }}
                          key={champion}
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
                              position: "absolute",
                              bottom: 24,
                              display: "flex",
                              width: "100%",
                              justifyContent: "center",
                              gap: 8,
                            }}
                          >
                            {CHAMPION_ROLE_MAP[champion].map((role) => (
                              <div
                                style={{
                                  backgroundImage: `url(${classesImage})`,
                                  width: 40,
                                  height: 40,
                                  backgroundSize: "300% 200%",
                                  backgroundRepeat: "no-repeat",
                                  backgroundPosition: positionMap[role],
                                  borderRadius: 4,
                                }}
                              />
                            ))}
                          </div>
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
