import { isVNPhoneNumber, toSlug, timeFuture } from "./index";

const phoneNumber = "0346712345";
const notPhoneNumber = "03a46712345";
const notVNPhoneNumber = "0646712345";
const stringNotAPhone = "acbsdhoh";

describe("isPhoneNumber test", () => {
  it("can be correctly", async () => {
    expect(isVNPhoneNumber(phoneNumber)).toEqual(true);
    expect(isVNPhoneNumber(notPhoneNumber)).toEqual(false);
    expect(isVNPhoneNumber(notVNPhoneNumber)).toEqual(false);
    expect(isVNPhoneNumber(stringNotAPhone)).toEqual(false);
  });
});

const vnString =
  "bầu ơi thương lấy bí cùng, tuy rằng khác giống nhưng chung một giàn";
const expectVnString =
  "bau-oi-thuong-lay-bi-cung-tuy-rang-khac-giong-nhung-chung-mot-gian";
const stringContainNumber = "tôi đi tìm hạnh phúc 02 tái bản lần 10";
const expectContainNumber = "toi-di-tim-hanh-phuc-02-tai-ban-lan-10";

describe("toSlug test", () => {
  it("can be created correctly", async () => {
    expect(toSlug(vnString).slice(0, -7)).toEqual(expectVnString);
    expect(toSlug(stringContainNumber).slice(0, -7)).toEqual(
      expectContainNumber
    );
  });

  it("input with null should return empty", async () => {
    expect(toSlug(null)).toEqual('');
  });
});

describe("futureTime test", () => {
  it("can be created correctly", async () => {
    expect(timeFuture(new Date())[0]).toEqual('Hôm nay');
    expect(timeFuture(new Date())[1]).toEqual(new Date().getDate() + '/' + (new Date().getMonth() + 1));

    let now = new Date();
    now.setDate(now.getDate() + 2)

    expect(timeFuture(now)[1]).toEqual(now.getDate() + '/' + (now.getMonth() + 1));
  });
});